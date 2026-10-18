"use client";

import { useCallback, useEffect, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import type { VideoCourse } from "@/lib/studio";
import { Stage } from "./Stage";

/* The video player. A lesson plays its scenes in order, each narrated, and
 * then STOPS on its quick check — the video does not move on until the
 * learner answers. That stop is the product: a quiz you can scroll past is a
 * slide, not a check.
 *
 * ⚠️ THE VOICE IS THE BROWSER'S (speechSynthesis), a stand-in for rendered
 * audio — see lib/studio.ts. Where the browser has no speech, a scene holds
 * for its reading time instead, so the player still works silently. */

function speak(text: string, voiceName: string, rate: number, onEnd: () => void): () => void {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  if (!synth) {
    const t = window.setTimeout(onEnd, Math.max(2500, text.split(/\s+/).length * 380 / rate));
    return () => window.clearTimeout(t);
  }
  let live = true;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = synth.getVoices().find((x) => x.name === voiceName);
  if (v) u.voice = v;
  u.rate = rate;
  u.onend = () => live && onEnd();
  u.onerror = () => live && onEnd();
  synth.speak(u);
  return () => {
    live = false;
    synth.cancel();
  };
}

type Pos = { li: number; step: number };

export function Player({ course }: { course: VideoCourse }) {
  const lessons = course.lessons;
  const [pos, setPos] = useState<Pos>({ li: 0, step: 0 });
  const [playing, setPlaying] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState({ right: 0, asked: 0 });

  const lesson = lessons[pos.li];
  const onQuiz = !!lesson && pos.step >= lesson.scenes.length;
  const scene = lesson && !onQuiz ? lesson.scenes[pos.step] : lesson?.scenes[lesson.scenes.length - 1] ?? null;

  const advance = useCallback(() => {
    const l = lessons[pos.li];
    if (!l) return;
    const nextStep = pos.step + 1;
    if (nextStep < l.scenes.length || (nextStep === l.scenes.length && l.quiz)) setPos({ li: pos.li, step: nextStep });
    else if (pos.li + 1 < lessons.length) setPos({ li: pos.li + 1, step: 0 });
    else {
      setFinished(true);
      setPlaying(false);
    }
  }, [lessons, pos]);

  // Narrate the current scene while playing.
  useEffect(() => {
    if (!playing || onQuiz || finished || !lesson) return;
    const s = lesson.scenes[pos.step];
    if (!s) return;
    return speak(s.narration, course.voice, course.rate || 1, advance);
  }, [playing, onQuiz, finished, lesson, pos.step, course.voice, course.rate, advance]);

  // Stop talking when the player goes away.
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const jumpLesson = (li: number) => {
    window.speechSynthesis?.cancel();
    setFinished(false);
    setPicked(null);
    setPos({ li, step: 0 });
  };

  const back = () => {
    window.speechSynthesis?.cancel();
    setPicked(null);
    setPos((p) => (p.step > 0 ? { li: p.li, step: Math.min(p.step - 1, (lessons[p.li]?.scenes.length ?? 1) - 1) } : p.li > 0 ? { li: p.li - 1, step: 0 } : p));
  };

  const answer = (i: number) => {
    if (picked !== null || !lesson?.quiz) return;
    setPicked(i);
    setScore((s) => ({ right: s.right + (i === lesson.quiz!.answer ? 1 : 0), asked: s.asked + 1 }));
  };

  const afterQuiz = () => {
    setPicked(null);
    if (pos.li + 1 < lessons.length) {
      setPos({ li: pos.li + 1, step: 0 });
    } else {
      setFinished(true);
      setPlaying(false);
    }
  };

  const restart = () => {
    setFinished(false);
    setScore({ right: 0, asked: 0 });
    setPos({ li: 0, step: 0 });
    setPlaying(true);
  };

  if (!lessons.length) return <p className="st-hint">This course has no lessons yet.</p>;

  const total = lesson.scenes.length;
  const sceneLabel = onQuiz ? "QUICK CHECK" : `SCENE ${pos.step + 1}/${total}`;

  return (
    <div className="st-player">
      <div>
        <div className="st-screen">
          <Stage
            scene={scene}
            style={course.style}
            eyebrow={`Lesson ${String(pos.li + 1).padStart(2, "0")} · ${sceneLabel}`}
            foot={[course.creator, course.title]}
            animate
          />

          {onQuiz && lesson.quiz && !finished && (
            <div className="st-quiz-layer">
              <div className="st-quiz-card" role="dialog" aria-label="Quick check">
                <span className="st-eyebrow">Quick check</span>
                <p className="st-quiz-q">{lesson.quiz.question}</p>
                <div className="st-opts">
                  {lesson.quiz.options.map((o, i) => {
                    const state = picked === null ? "" : i === lesson.quiz!.answer ? " is-right" : i === picked ? " is-wrong" : "";
                    return (
                      <button key={o} type="button" className={"st-opt" + state} disabled={picked !== null} onClick={() => answer(i)}>
                        {o}
                        {state === " is-right" && <HugeIcon name="check" className="i i-16" />}
                      </button>
                    );
                  })}
                </div>
                <div className="st-quiz-foot">
                  <span>{picked === null ? "Pick one to carry on" : picked === lesson.quiz.answer ? "That's it." : "Not quite, the right one is marked."}</span>
                  {picked !== null && (
                    <button type="button" className="btn-pri" onClick={afterQuiz}>Continue</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {finished && (
            <div className="st-done">
              <span className="st-eyebrow">Course complete</span>
              <h3>{course.title}</h3>
              <p>{score.asked ? `${score.right} of ${score.asked} quick checks right` : "Nice work"}</p>
              <button type="button" className="btn-sec" onClick={restart}>Watch again</button>
            </div>
          )}
        </div>

        <div className="st-controls">
          <button type="button" className="st-ctl" aria-label="Back" onClick={back}><HugeIcon name="previous" className="i i-16" /></button>
          <button
            type="button"
            className="st-ctl is-main"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              if (finished) return restart();
              if (playing) window.speechSynthesis?.cancel();
              setPlaying((p) => !p);
            }}
          >
            <HugeIcon name={playing ? "pause" : "play"} className="i i-16 st-fill" />
          </button>
          <button type="button" className="st-ctl" aria-label="Next" onClick={() => { window.speechSynthesis?.cancel(); if (!onQuiz) advance(); }}><HugeIcon name="next" className="i i-16" /></button>
          <span className="st-progress" aria-hidden>
            {lesson.scenes.map((s, i) => <i key={s.id} className={i < pos.step || (i === pos.step && !onQuiz && playing) ? "is-done" : ""} />)}
            {lesson.quiz && <i className={"is-quiz" + (onQuiz && picked !== null ? " is-done" : "")} />}
          </span>
          <span className="st-time">{pos.li + 1} / {lessons.length}</span>
        </div>
        <p className="st-caption">{onQuiz ? "" : scene?.narration}</p>
      </div>

      <div className="st-chapters" aria-label="Lessons">
        <span className="st-eyebrow" style={{ padding: "0 8px 6px" }}>Lessons</span>
        {lessons.map((l, i) => (
          <button key={l.id} type="button" className={"st-chapter" + (i === pos.li ? " is-on" : "")} onClick={() => jumpLesson(i)}>
            <span className="st-num">{String(i + 1).padStart(2, "0")}</span>
            <span>
              {l.title}
              <small>{l.scenes.length} scenes{l.quiz ? " · 1 check" : ""}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
