import { useState } from "react";
import { useContent } from "../lib/i18n";
import { btn } from "../lib/ui";
import { ArrowRightIcon } from "./icons";
import Counter from "./reactbits/Counter";
import ElasticSlider from "./reactbits/ElasticSlider";
import Magnet from "./reactbits/Magnet";
import { Eyebrow, h2 } from "./shared";

/* Calculadora del costo del trabajo manual: controles ElasticSlider y cifras
   con Counter (React Bits). Todo sale de los datos que pone el visitante. */

// Los controles; el costo por hora y su moneda dependen del idioma
const fieldsFor = (CALCULATOR, words) => {
  const money = new Intl.NumberFormat(CALCULATOR.locale);
  const { rate } = CALCULATOR;
  return [
    {
      key: "people",
      label: words.people,
      min: 1,
      max: 20,
      step: 1,
      show: words.peopleValue,
    },
    {
      key: "hours",
      label: words.hours,
      min: 1,
      max: 40,
      step: 1,
      show: (v) => `${v} h`,
    },
    {
      key: "rate",
      label: `${words.rate} (${CALCULATOR.currency})`,
      min: rate.min,
      max: rate.max,
      step: rate.step,
      show: (v) => `$${money.format(v)}`,
    },
    {
      key: "share",
      label: words.share,
      min: 10,
      max: 100,
      step: 5,
      show: (v) => `${v} %`,
    },
  ];
};

const Calculator = () => {
  const { CALCULATOR, UI } = useContent();
  const words = UI.calculator;
  const fields = fieldsFor(CALCULATOR, words);
  const [values, setValues] = useState({
    people: 3,
    hours: 6,
    rate: CALCULATOR.rate.start,
    share: 60,
  });

  const hoursYear = values.people * values.hours * CALCULATOR.weeksPerYear;
  const costYear = hoursYear * values.rate;
  const hoursBack = Math.round((hoursYear * values.share) / 100);
  const moneyBack = Math.round((costYear * values.share) / 100);

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
      <div>
        <Eyebrow>{words.eyebrow}</Eyebrow>
        <h2 className={`${h2} mt-5`}>{CALCULATOR.title}</h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[color:var(--soft)]">
          {CALCULATOR.intro}
        </p>

        <div className="mt-10 space-y-7">
          {fields.map((field) => (
            <div key={field.key}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-[color:var(--soft)]">{field.label}</span>
                <span className="font-mono tabular-nums text-[color:var(--text)]">
                  {field.show(values[field.key])}
                </span>
              </div>
              <ElasticSlider
                value={values[field.key]}
                startingValue={field.min}
                maxValue={field.max}
                isStepped
                stepSize={field.step}
                onChange={(next) =>
                  setValues((current) => ({ ...current, [field.key]: next }))
                }
                formatValue={field.show}
                valuePosition="bubble"
                ariaLabel={field.label}
                rangeColor="#D4B27A"
                trackColor="rgba(255,255,255,0.1)"
                thumbColor="#F1F3F6"
                thickness={6}
                activeThickness={10}
                className="mt-3 text-[color:var(--accent)]"
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--raised)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.6)] md:p-8 lg:sticky lg:top-28">
        <p className="text-sm text-[color:var(--muted)]">{words.perYear}</p>
        <p className="mt-2 font-display font-semibold text-[color:var(--text)]">
          <Counter
            value={hoursYear}
            suffix=" h"
            locale={CALCULATOR.locale}
            fontSize="clamp(2.6rem, 6vw, 3.6rem)"
          />
        </p>
        <p className="mt-2 text-sm text-[color:var(--muted)]">{words.cost}</p>
        <p className="mt-1 font-display text-2xl font-semibold text-[color:var(--soft)]">
          <Counter
            value={costYear}
            prefix="$"
            suffix={` ${CALCULATOR.currency}`}
            locale={CALCULATOR.locale}
            fontSize="1.6rem"
          />
        </p>

        <div className="my-6 h-px bg-[color:var(--line)]" />

        <p className="text-sm text-[color:var(--muted)]">
          {words.recover(values.share)}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display font-semibold">
          <span className="text-[color:var(--accent)]">
            <Counter
              value={hoursBack}
              suffix=" h"
              locale={CALCULATOR.locale}
              fontSize="clamp(2.2rem, 5vw, 3rem)"
            />
          </span>
          <span className="text-xl text-[color:var(--clean)]">
            <Counter
              value={moneyBack}
              prefix="$"
              suffix={` ${CALCULATOR.currency}`}
              locale={CALCULATOR.locale}
              fontSize="1.35rem"
            />
          </span>
        </div>
        <p className="mt-2 text-xs text-[color:var(--muted)]">
          {words.weeks(CALCULATOR.weeksPerYear)}
        </p>

        <Magnet className="mt-7">
          <a href="#contacto" className={btn("primary")}>
            {words.cta} <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Magnet>
      </div>
    </div>
  );
};

export default Calculator;
