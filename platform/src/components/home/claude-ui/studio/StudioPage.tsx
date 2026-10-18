"use client";

import { useEffect, useRef, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { useIdentity } from "@/lib/identity";
import {
  buildOutline, deleteCourse, minutesOf, newCourse, SAMPLE_MATERIAL, STYLES, upsertCourse, useMyCourses,
  type Lesson, type VideoCourse,
} from "@/lib/studio";
import { CourseCard } from "./ExplorePage";
import { Player } from "./Player";
import { Stage } from "./Stage";
import "./studio.css";

/* The creator's side. Five steps, in the order a course is actually made:
 * MATERIAL (what you know) → OUTLINE (how it splits into lessons and scenes)
 * → STYLE (how it looks) → VOICE (how it sounds) → PREVIEW (watch it, then
 * publish it to Explore). Every edit saves as you go, so there is no Save
 * button to forget. */

const STEPS = ["Material", "Outline", "Style", "Voice", "Preview"] as const;
type Step = (typeof STEPS)[number];

export function StudioPage() {
  const mine = useMyCourses();
  const { identity } = useIdentity();
  const [editing, setEditing] = useState<string | null>(null);
  const course = mine.find((c) => c.id === editing) ?? null;

  const create = (material = "") => {
    const c = { ...newCourse(identity?.name ?? "You"), material };
    upsertCourse(c);
    setEditing(c.id);
  };

  if (course) return <Editor course={course} onBack={() => setEditing(null)} />;

  return (
    <div className="proj-page">
      <div className="proj-head">
        <h1 className="proj-title">Studio</h1>
        <div className="proj-actions">
          <button type="button" className="btn-pri" onClick={() => create()}>New video course</button>
        </div>
      </div>
      <p className="st-lede">Turn your notes into a short video course with quick checks inside it. Publish it and it shows up in Explore.</p>

      {mine.length === 0 ? (
        <>
          <ol className="st-steps-intro">
            {[
              ["Add your material", "Paste notes or upload a text file. Headings become lessons."],
              ["Check the outline", "Every lesson is a few short scenes and one quick check. Edit any line."],
              ["Pick a style and a voice", "Four looks, and any voice your device can speak in."],
              ["Preview and publish", "Watch it the way a learner will, then put it in Explore."],
            ].map(([t, d], i) => (
              <li key={t}>
                <span className="st-num">{String(i + 1).padStart(2, "0")}</span>
                <span><b>{t}</b><span>{d}</span></span>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn-pri" onClick={() => create()}>Start a course</button>
            <button type="button" className="btn-sec" onClick={() => create(SAMPLE_MATERIAL)}>Try it with sample notes</button>
          </div>
        </>
      ) : (
        <ul className="st-grid">
          {mine.map((c) => (
            <CourseCard
              key={c.id}
              c={c.lessons.length ? c : { ...c, lessons: [] }}
              onOpen={() => setEditing(c.id)}
              badge={<span className={"st-badge" + (c.status === "published" ? " is-live" : "")}>{c.status === "published" ? "Published" : "Draft"}</span>}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Editor({ course, onBack }: { course: VideoCourse; onBack: () => void }) {
  const [step, setStep] = useState<Step>(course.lessons.length ? "Outline" : "Material");
  const put = (patch: Partial<VideoCourse>) => upsertCourse({ ...course, ...patch });
  const ready = course.lessons.length > 0;

  return (
    <div className="proj-page">
      <div className="st-ed-head">
        <button type="button" className="btn-sec is-icon" aria-label="Back to Studio" onClick={onBack}>
          <HugeIcon name="chevron-left" className="i" />
        </button>
        <input
          className="st-title-input"
          value={course.title}
          aria-label="Course title"
          onChange={(e) => put({ title: e.target.value })}
          onFocus={(e) => course.title === "Untitled course" && e.target.select()}
        />
        <span className={"st-badge" + (course.status === "published" ? " is-live" : "")}>
          {course.status === "published" ? "Published" : "Draft"}
        </span>
      </div>

      <div className="st-tabs" role="tablist">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={step === s}
            className={"st-tab" + (step === s ? " is-on" : "")}
            disabled={i > 0 && !ready}
            onClick={() => setStep(s)}
          >
            <span className="st-num">{i + 1}</span>
            {s}
          </button>
        ))}
      </div>

      {step === "Material" && (
        <MaterialStep course={course} put={put} onBuilt={() => setStep("Outline")} />
      )}
      {step === "Outline" && <OutlineStep course={course} put={put} onNext={() => setStep("Style")} />}
      {step === "Style" && <StyleStep course={course} put={put} onNext={() => setStep("Voice")} />}
      {step === "Voice" && <VoiceStep course={course} put={put} onNext={() => setStep("Preview")} />}
      {step === "Preview" && (
        <>
          <Player course={course} key={course.id + course.style + course.voice} />
          <div className="st-actions">
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                if (window.confirm(`Delete "${course.title}"? This can't be undone.`)) {
                  deleteCourse(course.id);
                  onBack();
                }
              }}
            >
              <HugeIcon name="trash" className="i i-16" />
              Delete
            </button>
            <span style={{ flex: 1 }} />
            {course.status === "published" ? (
              <button type="button" className="btn-sec" onClick={() => put({ status: "draft" })}>Unpublish</button>
            ) : (
              <button type="button" className="btn-pri" onClick={() => put({ status: "published" })}>Publish to Explore</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

type StepProps = { course: VideoCourse; put: (p: Partial<VideoCourse>) => void };

function MaterialStep({ course, put, onBuilt }: StepProps & { onBuilt: () => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const words = course.material.trim() ? course.material.trim().split(/\s+/).length : 0;
  const enough = words >= 60;

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const text = await f.text();
    put({ material: course.material ? `${course.material}\n\n${text}` : text });
  };

  return (
    <>
      <div className="st-panel">
        <textarea
          className="st-textarea"
          placeholder={"Paste your notes here.\n\nStart a line with # to make it a lesson title, for example:\n# Fixed and variable costs"}
          value={course.material}
          onChange={(e) => put({ material: e.target.value })}
        />
        <div className="st-bar">
          <input ref={fileRef} className="st-file" type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" className="btn-sec" onClick={() => fileRef.current?.click()}>
            <HugeIcon name="upload" className="i i-16" />
            Upload a text file
          </button>
          {!course.material && (
            <button type="button" className="btn-sec" onClick={() => put({ material: SAMPLE_MATERIAL })}>Use sample notes</button>
          )}
          <span className="st-grow" />
          <span className="st-hint">{words} words{enough ? "" : " · add at least 60"}</span>
        </div>
      </div>
      <div className="st-actions">
        <button
          type="button"
          className="btn-pri"
          disabled={!enough}
          onClick={() => {
            if (course.lessons.length && !window.confirm("Rebuild the outline from this material? Edits to the current outline will be replaced.")) return;
            const lessons = buildOutline(course.material);
            put({
              lessons,
              // An untitled course takes its first lesson's name until the
              // creator types one, so the card in Studio is never "Untitled".
              title: course.title === "Untitled course" && lessons[0] ? lessons[0].title : course.title,
            });
            onBuilt();
          }}
        >
          {course.lessons.length ? "Rebuild outline" : "Build outline"}
        </button>
      </div>
    </>
  );
}

function OutlineStep({ course, put, onNext }: StepProps & { onNext: () => void }) {
  const setLesson = (id: string, fn: (l: Lesson) => Lesson) =>
    put({ lessons: course.lessons.map((l) => (l.id === id ? fn(l) : l)) });

  return (
    <>
      <p className="st-hint" style={{ marginBottom: 16 }}>
        {course.lessons.length} lessons · about {minutesOf(course)} min. Every line below is what the voice will say.
      </p>
      <div className="st-lessons">
        {course.lessons.map((l, li) => (
          <section className="st-panel" key={l.id}>
            <div className="st-lesson-head">
              <span className="st-num">{String(li + 1).padStart(2, "0")}</span>
              <input
                className="st-lesson-title"
                value={l.title}
                aria-label={`Lesson ${li + 1} title`}
                onChange={(e) => setLesson(l.id, (x) => ({ ...x, title: e.target.value }))}
              />
              <button
                type="button"
                className="btn-sec is-icon"
                aria-label="Remove lesson"
                onClick={() => put({ lessons: course.lessons.filter((x) => x.id !== l.id) })}
              >
                <HugeIcon name="trash" className="i i-16" />
              </button>
            </div>
            {l.scenes.map((s, si) => (
              <div className="st-scene" key={s.id}>
                <span className="st-num">{si + 1}</span>
                <textarea
                  className="st-scene-text"
                  value={s.narration}
                  aria-label={`Scene ${si + 1}`}
                  onChange={(e) =>
                    setLesson(l.id, (x) => ({
                      ...x,
                      scenes: x.scenes.map((y) =>
                        y.id === s.id
                          ? { ...y, narration: e.target.value, lines: e.target.value.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2) }
                          : y,
                      ),
                    }))
                  }
                />
              </div>
            ))}
            {l.quiz ? (
              <div className="st-quiz">
                <span className="st-eyebrow">Quick check · stops the video</span>
                <div style={{ marginTop: 4 }}><b>{l.quiz.question}</b></div>
                <div>Answer: {l.quiz.options[l.quiz.answer]} · also offered: {l.quiz.options.filter((_, i) => i !== l.quiz!.answer).join(", ")}</div>
              </div>
            ) : (
              <div className="st-quiz">No quick check could be written from this lesson. Add a longer sentence and rebuild.</div>
            )}
          </section>
        ))}
      </div>
      <div className="st-actions">
        <button type="button" className="btn-pri" disabled={!course.lessons.length} onClick={onNext}>Next: style</button>
      </div>
    </>
  );
}

function StyleStep({ course, put, onNext }: StepProps & { onNext: () => void }) {
  const s0 = course.lessons[0]?.scenes[0];
  // A preview card is a quarter of the player's width, so it carries the
  // heading and one line, the same cut Explore's cards make.
  const first = s0 ? { heading: s0.heading, lines: s0.lines.slice(0, 1) } : null;
  return (
    <>
      <div className="st-styles">
        {STYLES.map((s) => (
          <button key={s.id} type="button" className={"st-style" + (course.style === s.id ? " is-on" : "")} onClick={() => put({ style: s.id })} aria-pressed={course.style === s.id}>
            <Stage scene={first} style={s.id} eyebrow="Lesson 01 · Scene 1" />
            <span className="st-style-name">{s.name}</span>
            <span className="st-style-blurb">{s.blurb}</span>
          </button>
        ))}
      </div>
      <div className="st-actions">
        <button type="button" className="btn-pri" onClick={onNext}>Next: voice</button>
      </div>
    </>
  );
}

function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const read = () => setVoices(synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en")));
    read();
    synth.addEventListener("voiceschanged", read);
    return () => synth.removeEventListener("voiceschanged", read);
  }, []);
  return voices;
}

function VoiceStep({ course, put, onNext }: StepProps & { onNext: () => void }) {
  const voices = useVoices();
  const sample = course.lessons[0]?.scenes[0]?.narration ?? "This is how your course will sound.";
  const play = (name: string) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(sample);
    const v = synth.getVoices().find((x) => x.name === name);
    if (v) u.voice = v;
    u.rate = course.rate || 1;
    synth.speak(u);
  };
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <>
      <div className="st-panel">
        <div className="st-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: 0, marginBottom: 12 }}>
          <span className="st-eyebrow">Speed</span>
          <span className="st-seg">
            {[["Calm", 0.9], ["Normal", 1], ["Brisk", 1.15]].map(([label, r]) => (
              <button key={label} type="button" className={"st-tab" + (course.rate === r ? " is-on" : "")} onClick={() => put({ rate: r as number })}>{label}</button>
            ))}
          </span>
        </div>
        {voices.length === 0 ? (
          <p className="st-hint">This device has no voices to offer, so the preview plays silently at reading pace. Rendered voices come later.</p>
        ) : (
          <div className="st-voices" role="listbox" aria-label="Voices">
            {voices.map((v) => {
              const on = course.voice === v.name || (!course.voice && v.default);
              return (
                <button
                  key={v.name}
                  type="button"
                  role="option"
                  aria-selected={on}
                  className={"st-voice" + (on ? " is-on" : "")}
                  onClick={() => { put({ voice: v.name }); play(v.name); }}
                >
                  <HugeIcon name="volume" className="i i-16" />
                  {v.name}
                  <small>{v.lang}</small>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="st-actions">
        <button type="button" className="btn-sec" onClick={() => play(course.voice)}>
          <HugeIcon name="play" className="i i-16 st-fill" />
          Hear a sample
        </button>
        <button type="button" className="btn-pri" onClick={onNext}>Next: preview</button>
      </div>
    </>
  );
}
