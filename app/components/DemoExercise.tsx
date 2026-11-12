"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExerciseFields, ExerciseTimer } from "./exercise-ui";
import type { ExerciseKind, Field } from "./exercise-ui";

// Independently written UI fixtures. Not a psychological exercise protocol.
const steps = ["Sample form", "Sample timer", "Sample review"];
const fields: Field[] = [
  { id: "title", label: "Sample title", placeholder: "e.g. My interface test" },
  { id: "notes", label: "Sample notes", placeholder: "Use fictional text to test this layout", type: "textarea", required: true },
  { id: "layout", label: "Sample choice", type: "choice", options: [
    { value: "one", label: "Option one" }, { value: "two", label: "Option two" },
  ] },
];

export function GuidedExercise({ kind }: { kind: ExerciseKind }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) { window.clearInterval(timer); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  function next() {
    if (step === 0 && !answers.notes?.trim()) { setError(true); return; }
    setRunning(false);
    setStep((value) => value + 1);
  }
  function toggleTimer() {
    if (seconds === 0) { setSeconds(30); setRunning(false); }
    else setRunning((value) => !value);
  }
  return <main className="exercise-page" data-exercise-source="demo">
    <header className="exercise-header">
      <Link className="back-link" href={`${basePath}/`}>← Home</Link>
      <div className="exercise-identity"><div><strong>Contributor demo</strong><span>{kind} · sample content</span></div></div>
      <span className="local-note">Not saved</span>
    </header>
    <div className="exercise-layout">
      <aside className="exercise-sidebar" aria-label="Demo progress"><p>Test the interface with fictional answers. This demo contains no real exercise instructions.</p><ol>{steps.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "done" : ""}><span>{index < step ? "✓" : index + 1}</span><div><small>Step {index + 1}</small><strong>{label}</strong></div></li>)}</ol></aside>
      <section className="exercise-card" aria-live="polite">
        <p className="exercise-eyebrow">Interface testing only</p>
        {step === -1 ? <>
          <h1>Explore the contributor demo</h1>
          <p className="exercise-guidance">Try the form, navigation, timer and summary. Share UX feedback or propose a code change on GitHub.</p>
          <div className="protocol-note"><strong>Sample content</strong><p>This is not a psychological exercise. Answers stay in memory and disappear when this page is closed or refreshed. No payment or license is needed.</p></div>
          <div className="exercise-actions"><button className="button-primary" onClick={next}>Begin demo →</button></div>
        </> : step < steps.length ? <>
          <div className="progress-mobile"><span>Step {step + 1} of {steps.length}</span><span>{Math.round((step + 1) / steps.length * 100)}%</span></div>
          <div className="progress-track" aria-hidden="true"><span style={{ width: `${(step + 1) / steps.length * 100}%` }} /></div>
          <h1>{steps[step]}</h1>
          {step === 0 && <ExerciseFields scope="demo" fields={fields} answers={answers} onChange={(id, value) => { setAnswers((previous) => ({ ...previous, [id]: value })); setError(false); }} />}
          {step === 1 && <><p className="exercise-guidance">Test starting, pausing and resetting the sample timer.</p><ExerciseTimer seconds={seconds} duration={30} running={running} onToggle={toggleTimer} /></>}
          {step === 2 && <div className="protocol-note"><strong>Review the layout</strong><p>Continue to see how your fictional answers appear in a summary.</p></div>}
          {error && <p className="field-error" role="alert">Please add sample notes before continuing.</p>}
          <div className="exercise-actions"><button className="button-secondary" onClick={() => { setRunning(false); setStep((value) => value - 1); }}>Back</button><button className="button-primary" onClick={next}>{step === 2 ? "Complete demo" : "Continue"} →</button></div>
        </> : <div className="result-view">
          <div className="result-check" aria-hidden="true">✓</div><h1>{answers.title?.trim() || "No title"}</h1>
          <div className="result-script"><p>{answers.notes}</p><p>{answers.layout || "No sample choice selected"}</p></div>
          <div className="practice-tip"><strong>Test repetition</strong><p>Return to the timer without losing your sample answers.</p><button className="button-primary practice-again-button" onClick={() => { setSeconds(30); setRunning(false); setStep(1); }}>Practise again →</button></div>
          <p className="privacy-reminder">Demo answers are not saved to Private Journal.</p>
          <div className="exercise-actions result-actions"><button className="button-secondary" onClick={() => setStep(0)}>Edit answers</button><button className="button-secondary" onClick={() => { setAnswers({}); setSeconds(30); setRunning(false); setStep(-1); }}>New demo</button><Link className="text-link" href={`${basePath}/`}>Finish</Link></div>
        </div>}
      </section>
    </div>
  </main>;
}
