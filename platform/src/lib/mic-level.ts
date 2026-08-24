/* ------------------------------------------------------------------ *
 * How loudly the student is speaking, 0..1, sampled off the real microphone.
 *
 * Owner, 2026-08-23: the voice screen is "mostly blank, especially when
 * starting. A glowing sort of effect will happen from the bottom, showing that
 * the microphone is being heard."
 *
 * "Being heard" is the requirement, and it is a stricter one than it sounds. A
 * glow that pulses on a timer looks identical to a glow that tracks a voice
 * for about two seconds, and then it is obviously a lie — a student says
 * nothing and it keeps breathing, or they talk and it ignores them. So this
 * reads the actual input, and when it cannot, the screen says so rather than
 * miming.
 *
 * ⚠️ THIS IS THE ONLY MICROPHONE READER ON THIS SURFACE, DELIBERATELY. When
 * the ElevenLabs agent lands it will open its own stream for the conversation;
 * this one exists to draw the glow and is torn down the moment the screen
 * stops needing it. Two live captures of one device is how a phone ends up
 * with a stuck recording indicator.
 *
 * ⚠️ `Permissions-Policy: microphone=(self)` IS LOAD-BEARING, and an empty
 * allowlist is not "no opinion" — it is "nobody, INCLUDING this origin". With
 * `microphone=()` getUserMedia rejects with NotAllowedError *after* the
 * student has already granted permission in the browser's own prompt, so the
 * app blames them for a header. That shipped and cost the whole of the voice
 * feature in production until 2026-08-22. If the glow is dead everywhere and
 * nowhere in development, check the header before the code.
 * ------------------------------------------------------------------ */

export type MicStatus = "idle" | "asking" | "listening" | "denied" | "unsupported" | "error";

export type MicReader = {
  /** Latest level, 0..1, already smoothed. Read it in a rAF loop. */
  level(): number;
  stop(): void;
};

/**
 * How fast the drawn level chases the measured one.
 *
 * Two constants, not one, because a level meter that rises and falls at the
 * same rate feels wrong in a way that is hard to name: speech starts abruptly
 * and decays, so the glow must jump to a syllable and ease off it. Equal rates
 * either lag every word (slow) or strobe on every consonant (fast).
 */
const ATTACK = 0.45;
const RELEASE = 0.12;

/** Below this, treat it as silence rather than as a very quiet voice. Room
 *  tone on a phone sits around 0.01–0.02 RMS and would otherwise hold the glow
 *  permanently, faintly, on — which reads as broken rather than as quiet. */
const FLOOR = 0.022;

/**
 * Open the microphone and start measuring.
 *
 * Resolves with a reader, or rejects with a `MicStatus` describing why not —
 * the caller renders that, so every failure has a sentence a student can act
 * on rather than a spinner that never resolves.
 */
export async function openMic(): Promise<MicReader> {
  if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw "unsupported" satisfies MicStatus;
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        /* The browser's own cleanup, on. This is a level meter for a voice, not
           an instrument: suppressing the fan and the road outside makes the
           glow track the person rather than the room. */
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (e) {
    const name = (e as { name?: string })?.name;
    throw (name === "NotAllowedError" || name === "SecurityError"
      ? "denied"
      : "error") satisfies MicStatus;
  }

  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) {
    for (const t of stream.getTracks()) t.stop();
    throw "unsupported" satisfies MicStatus;
  }

  const ctx = new Ctx();
  /* Safari hands back a suspended context when it was not created inside a
     user gesture, and a suspended context's analyser reports pure silence
     forever with no error anywhere. Every caller here IS inside a gesture, so
     this is belt and braces — but a silent-and-fine failure is exactly the
     kind this file exists to not have. */
  if (ctx.state === "suspended") await ctx.resume().catch(() => {});

  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  /* 1024 gives ~21ms of audio at 48kHz — about one frame's worth, so the meter
     never reports a window the eye has already moved past. */
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0;
  source.connect(analyser);

  const buf = new Float32Array(analyser.fftSize);
  let smoothed = 0;
  let stopped = false;

  return {
    level() {
      if (stopped) return 0;
      analyser.getFloatTimeDomainData(buf);

      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);

      /* RMS is linear and hearing is not: a voice at conversational volume
         sits near 0.05, which as a raw fraction of 1 would barely move the
         glow. The cube root opens the bottom of the range out, which is where
         a speaking voice actually lives. */
      const shaped = rms < FLOOR ? 0 : Math.min(1, Math.cbrt(rms * 8));

      const k = shaped > smoothed ? ATTACK : RELEASE;
      smoothed += (shaped - smoothed) * k;
      return smoothed;
    },
    stop() {
      if (stopped) return;
      stopped = true;
      try {
        source.disconnect();
      } catch {}
      for (const t of stream.getTracks()) t.stop();
      /* Closing returns a promise that rejects if the context already went
         away with the page. Nothing useful to do with that. */
      void ctx.close().catch(() => {});
    },
  };
}
