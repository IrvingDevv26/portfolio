import { useState } from "react";
import { useContent } from "../lib/i18n";
import { useToast } from "../lib/toast";
import { btn, focusRing } from "../lib/ui";
import { CheckIcon } from "./icons";
import Stepper, { Step } from "./reactbits/Stepper";

/* Brief de proyecto en 3 pasos (Stepper de React Bits). No necesita backend:
   al terminar arma un correo con las respuestas, listo para enviar o copiar. */

const STEPPER_THEME = {
  "--stepper-frame": "rgba(16, 18, 23, 0.85)",
  "--stepper-frame-edge": "rgba(255, 255, 255, 0.09)",
  "--stepper-frame-highlight": "rgba(255, 255, 255, 0.06)",
  "--stepper-tile": "linear-gradient(180deg, #1C1F26 0%, #14161B 100%)",
  "--stepper-tile-edge": "rgba(255, 255, 255, 0.08)",
  "--stepper-well": "rgba(255, 255, 255, 0.05)",
  "--stepper-ink": "#F1F3F6",
  "--stepper-muted": "rgba(241, 243, 246, 0.55)",
};

const field =
  "mt-1.5 w-full rounded-lg border border-[color:var(--line-strong)] bg-[color:var(--ink)] px-3 py-2 text-sm text-[color:var(--text)] placeholder:text-[color:var(--faint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--accent)]";

const label = "text-sm font-medium text-[color:var(--text)]";

const Chip = ({ selected, onClick, children }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
      selected
        ? "border-[color:var(--accent-line)] bg-[color:var(--accent-bg)] text-[color:var(--accent)]"
        : "border-[color:var(--line)] text-[color:var(--soft)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--text)]"
    } ${focusRing}`}
  >
    {children}
  </button>
);

const ChipGroup = ({ legend, options, isSelected, onPick }) => (
  <fieldset>
    <legend className={label}>{legend}</legend>
    <div className="mt-2.5 flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option}
          selected={isSelected(option)}
          onClick={() => onPick(option)}
        >
          {option}
        </Chip>
      ))}
    </div>
  </fieldset>
);

const toggle = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const ProjectBrief = () => {
  const { BRIEF, PROFILE, UI } = useContent();
  const words = UI.brief;
  const notify = useToast();
  const [step, setStep] = useState(1);
  const [areas, setAreas] = useState([]);
  const [detail, setDetail] = useState("");
  const [tools, setTools] = useState([]);
  const [hours, setHours] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");

  const subject = words.subject(company.trim());
  const body = words.body({
    name: name.trim(),
    company: company.trim(),
    areas: areas.join(", "),
    detail: detail.trim(),
    tools: tools.join(", "),
    hours,
  });
  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Cada paso valida antes de avanzar
  const validate = (event) => {
    if (step === 1 && !areas.length && !detail.trim()) {
      event.preventDefault();
      setError(words.needArea);
      return;
    }
    if (step === 3 && !name.trim()) {
      event.preventDefault();
      setError(words.needName);
      return;
    }
    setError("");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${words.to}: ${PROFILE.email}\n${words.subjectLabel}: ${subject}\n\n${body}`,
      );
      notify(words.copied, words.copiedDetail(PROFILE.email));
    } catch {
      window.location.href = mailto;
    }
  };

  return (
    <div>
      <p className="font-display text-lg font-semibold text-[color:var(--text)]">
        {BRIEF.title}
      </p>
      <p className="mt-1 text-sm text-[color:var(--muted)]">{BRIEF.intro}</p>

      <Stepper
        className="mt-5"
        step={step}
        onStepChange={(next) => {
          setError("");
          setStep(next);
        }}
        onFinalStepCompleted={() => setStep(4)}
        linear
        width="100%"
        radius={20}
        accentColor="#D4B27A"
        style={STEPPER_THEME}
        nextButtonProps={{ onClick: validate }}
        backButtonText={words.back}
        nextButtonText={words.next}
        completeButtonText={words.complete}
        completedContent={
          <div className="text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] text-[color:var(--clean)]">
              <CheckIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-lg font-semibold text-[color:var(--text)]">
              {words.ready}
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {words.readyText(PROFILE.email)}
            </p>
            <pre className="mt-4 max-h-44 overflow-auto whitespace-pre-wrap rounded-lg border border-[color:var(--line)] bg-[color:var(--ink)] p-3 text-left font-mono text-xs leading-relaxed text-[color:var(--soft)]">
              {body}
            </pre>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a href={mailto} className={btn("primary", "sm")}>
                {words.open}
              </a>
              <button
                type="button"
                onClick={copy}
                className={btn("secondary", "sm")}
              >
                {words.copy}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`mt-3 rounded text-sm text-[color:var(--muted)] underline underline-offset-4 hover:text-[color:var(--text)] ${focusRing}`}
            >
              {words.edit}
            </button>
          </div>
        }
      >
        <Step title={words.steps[0]}>
          <div className="space-y-4">
            <ChipGroup
              legend={words.areas}
              options={BRIEF.areas}
              isSelected={(o) => areas.includes(o)}
              onPick={(o) => setAreas((list) => toggle(list, o))}
            />
            <label className="block">
              <span className={label}>{words.describe}</span>
              <textarea
                rows={2}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder={words.describePlaceholder}
                className={`${field} resize-none`}
              />
            </label>
          </div>
        </Step>

        <Step title={words.steps[1]}>
          <div className="space-y-5">
            <ChipGroup
              legend={words.tools}
              options={BRIEF.tools}
              isSelected={(o) => tools.includes(o)}
              onPick={(o) => setTools((list) => toggle(list, o))}
            />
            <ChipGroup
              legend={words.hours}
              options={BRIEF.hours}
              isSelected={(o) => hours === o}
              onPick={(o) => setHours((current) => (current === o ? "" : o))}
            />
          </div>
        </Step>

        <Step title={words.steps[2]}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>{words.name}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder={words.namePlaceholder}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>{words.company}</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                placeholder={words.companyPlaceholder}
                className={field}
              />
            </label>
          </div>
        </Step>
      </Stepper>

      <p role="alert" className="mt-3 min-h-5 text-sm text-[color:var(--warn)]">
        {error}
      </p>
    </div>
  );
};

export default ProjectBrief;
