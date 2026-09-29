"use client";

import { useEffect, useRef, useState } from 'react'

export const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'
/** First-frame still shown until the video has a frame. None exists yet: save
 *  one to public/design2/hero-poster.jpg and point this at it. A path to a
 *  missing file is worse than none — the 404 lands before hydration, so
 *  onError never runs and the browser draws a broken-image frame. */
const POSTER: string | null = null

const MAX_FRAMES = 90
const MIN_FRAMES = 24
const FRAMES_PER_SECOND = 12
const MAX_FRAME_WIDTH = 960
const LERP = 0.12
const SEEK_EPSILON = 0.04

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function once(el: HTMLVideoElement, event: string) {
  return new Promise<void>((resolve, reject) => {
    const ok = () => {
      el.removeEventListener('error', fail)
      resolve()
    }
    const fail = () => {
      el.removeEventListener(event, ok)
      reject(new Error(`video ${event} failed`))
    }
    el.addEventListener(event, ok, { once: true })
    el.addEventListener('error', fail, { once: true })
  })
}

/** Draws a source into the canvas with object-cover math (scale to fill, centre crop). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sw: number,
  sh: number,
  cw: number,
  ch: number,
) {
  const scale = Math.max(cw / sw, ch / sh)
  const dw = sw * scale
  const dh = sh * scale
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(source, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
}

/**
 * Fixed full-bleed background whose timeline is driven by page scroll, never
 * by playback. Poster → <video> (seek fallback) → <canvas> (cached frames),
 * each crossfading over 500ms as the next becomes ready.
 */
export function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frames = useRef<ImageBitmap[]>([])
  const cacheReadyRef = useRef(false)
  const target = useRef(0)
  const smoothed = useRef(0)

  const [hasFrame, setHasFrame] = useState(false)
  const [cacheReady, setCacheReady] = useState(false)
  const [posterOk, setPosterOk] = useState(POSTER !== null)

  // Scroll → target progress.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target.current = max > 0 ? clamp01(window.scrollY / max) : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Canvas sizing + the rAF loop that smooths progress and draws/seeks.
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let lastIndex = -1
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      lastIndex = -1
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    const tick = () => {
      smoothed.current += (target.current - smoothed.current) * LERP
      const p = smoothed.current

      if (cacheReadyRef.current && frames.current.length) {
        const list = frames.current
        const index = Math.round(p * (list.length - 1))
        if (index !== lastIndex) {
          const bmp = list[index]
          drawCover(ctx, bmp, bmp.width, bmp.height, canvas.width, canvas.height)
          lastIndex = index
        }
      } else {
        const v = videoRef.current
        if (v && Number.isFinite(v.duration) && v.duration > 0 && !v.seeking) {
          const want = p * Math.max(0, v.duration - 0.05)
          if (Math.abs(v.currentTime - want) > SEEK_EPSILON) v.currentTime = want
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Once the visible video has a frame, yield 300ms, then build the frame cache
  // from an offscreen copy of the same file.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let cancelled = false
    let timer = 0
    const built: ImageBitmap[] = []

    const extract = async () => {
      const off = document.createElement('video')
      off.muted = true
      off.playsInline = true
      off.preload = 'auto'
      off.src = HERO_VIDEO
      try {
        if (off.readyState < 1) await once(off, 'loadedmetadata')
        const duration = off.duration
        if (!Number.isFinite(duration) || duration <= 0) return
        const count = Math.min(MAX_FRAMES, Math.max(MIN_FRAMES, Math.floor(duration * FRAMES_PER_SECOND)))
        const width = Math.min(MAX_FRAME_WIDTH, off.videoWidth || MAX_FRAME_WIDTH)
        const last = Math.max(0, duration - 0.05)

        for (let i = 0; i < count; i++) {
          if (cancelled) return
          off.currentTime = (i / (count - 1)) * last
          await once(off, 'seeked')
          built.push(await createImageBitmap(off, { resizeWidth: width, resizeQuality: 'medium' }))
        }
        if (cancelled) return
        frames.current = built
        cacheReadyRef.current = true
        setCacheReady(true)
      } catch {
        // Stay on the seek fallback.
        built.forEach((b) => b.close())
      } finally {
        off.removeAttribute('src')
        off.load()
      }
    }

    const onLoaded = () => {
      setHasFrame(true)
      timer = window.setTimeout(() => void extract(), 300)
    }
    if (v.readyState >= 2) onLoaded()
    else v.addEventListener('loadeddata', onLoaded, { once: true })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      v.removeEventListener('loadeddata', onLoaded)
      if (!cacheReadyRef.current) built.forEach((b) => b.close())
    }
  }, [])

  // Release cached frames on unmount.
  useEffect(
    () => () => {
      frames.current.forEach((b) => b.close())
      frames.current = []
      cacheReadyRef.current = false
    },
    [],
  )

  const fade = 'absolute inset-0 h-full w-full object-cover transition-opacity duration-500'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]">
      {POSTER && posterOk && (
        <img
          src={POSTER}
          alt=""
          onError={() => setPosterOk(false)}
          className={`${fade} ${hasFrame || cacheReady ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        muted
        playsInline
        preload="auto"
        className={`${fade} ${hasFrame && !cacheReady ? 'opacity-100' : 'opacity-0'}`}
      />
      <canvas ref={canvasRef} className={`${fade} ${cacheReady ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}
