"use client";

// Shared interface only; no psychological content or branching rules.
export type ExerciseKind = "imagery" | "inner-voice" | "anxiety-balance" | "anxiety-pressure";
export type Field = {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "choice";
  required?: boolean;
  options?: { value: string; label: string }[];
};

export function ExerciseFields({ scope, fields, answers, onChange }: {
  scope: string; fields: Field[]; answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
}) {
  return <div className="exercise-fields">{fields.map((field) => (
    <fieldset className={field.type === "choice" ? "choice-field" : "text-field"} key={field.id}>
      <legend><span id={`${scope}-${field.id}-label`}>{field.label}</span><em>{field.required ? "Required" : "Optional"}</em></legend>
      {field.type === "choice" ? (
        <div className="choice-grid">{field.options?.map((option) => <label className={answers[field.id] === option.value ? "selected" : ""} key={option.value}><input type="radio" name={`${scope}-${field.id}`} value={option.value} checked={answers[field.id] === option.value} onChange={(event) => onChange(field.id, event.target.value)} /><span>{option.label}</span></label>)}</div>
      ) : field.type === "textarea" ? (
        <textarea aria-labelledby={`${scope}-${field.id}-label`} rows={3} value={answers[field.id] || ""} onChange={(event) => onChange(field.id, event.target.value)} placeholder={field.placeholder} />
      ) : (
        <input aria-labelledby={`${scope}-${field.id}-label`} value={answers[field.id] || ""} onChange={(event) => onChange(field.id, event.target.value)} placeholder={field.placeholder} />
      )}
    </fieldset>
  ))}</div>;
}

export function ExerciseTimer({ seconds, duration, running, onToggle }: {
  seconds: number; duration: number; running: boolean; onToggle: () => void;
}) {
  return <div className="timer-panel">
    <span className="timer-value" aria-live="off">{seconds}</span><span className="timer-label">seconds</span>
    <button className="button-primary" type="button" onClick={onToggle}>{seconds === 0 ? "Practise again" : running ? "Pause" : `Start ${duration} seconds`}</button>
  </div>;
}
