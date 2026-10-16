import { useState } from "react";
import { CALCULATOR } from "../content";
import { btn } from "../lib/ui";
import { ArrowRightIcon } from "./icons";
import Counter from "./reactbits/Counter";
import ElasticSlider from "./reactbits/ElasticSlider";
import Magnet from "./reactbits/Magnet";
import { Eyebrow, h2 } from "./shared";

/* Calculadora del costo del trabajo manual: controles ElasticSlider y cifras
   con Counter (React Bits). Todo sale de los datos que pone el visitante. */

const money = new Intl.NumberFormat("es-MX");

const FIELDS = [
  {
    key: "people",
    label: "Personas que hacen la tarea",
    min: 1,
    max: 20,
    step: 1,
    show: (v) => `${v} ${v === 1 ? "persona" : "personas"}`,
  },
  {
    key: "hours",
    label: "Horas por semana, por persona",
    min: 1,
    max: 40,
    step: 1,
    show: (v) => `${v} h`,
  },
  {
    key: "rate",
    label: `Costo por hora (${CALCULATOR.currency})`,
    min: 50,
    max: 1000,
    step: 10,
    show: (v) => `$${money.format(v)}`,
  },
  {
    key: "share",
    label: "Parte que se podría automatizar",
    min: 10,
    max: 100,
    step: 5,
    show: (v) => `${v} %`,
  },
];

const Calculator = () => {
  const [values, setValues] = useState({
    people: 3,
    hours: 6,
    rate: 150,
    share: 60,
  });

  const hoursYear = values.people * values.hours * CALCULATOR.weeksPerYear;
  const costYear = hoursYear * values.rate;
  const hoursBack = Math.round((hoursYear * values.share) / 100);
  const moneyBack = Math.round((costYear * values.share) / 100);

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
      <div>
        <Eyebrow>Calculadora</Eyebrow>
        <h2 className={`${h2} mt-5`}>{CALCULATOR.title}</h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[color:var(--soft)]">
          {CALCULATOR.intro}
        </p>

        <div className="mt-10 space-y-7">
          {FIELDS.map((field) => (
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
        <p className="text-sm text-[color:var(--muted)]">
          Al año, tu equipo dedica
        </p>
        <p className="mt-2 font-display font-semibold text-[color:var(--text)]">
          <Counter
            value={hoursYear}
            suffix=" h"
            fontSize="clamp(2.6rem, 6vw, 3.6rem)"
          />
        </p>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          a este proceso, con un costo aproximado de
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-[color:var(--soft)]">
          <Counter
            value={costYear}
            prefix="$"
            suffix={` ${CALCULATOR.currency}`}
            fontSize="1.6rem"
          />
        </p>

        <div className="my-6 h-px bg-[color:var(--line)]" />

        <p className="text-sm text-[color:var(--muted)]">
          Si automatizas el {values.share} %, podrías recuperar
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display font-semibold">
          <span className="text-[color:var(--accent)]">
            <Counter
              value={hoursBack}
              suffix=" h"
              fontSize="clamp(2.2rem, 5vw, 3rem)"
            />
          </span>
          <span className="text-xl text-[color:var(--clean)]">
            <Counter
              value={moneyBack}
              prefix="$"
              suffix={` ${CALCULATOR.currency}`}
              fontSize="1.35rem"
            />
          </span>
        </div>
        <p className="mt-2 text-xs text-[color:var(--muted)]">
          Considera {CALCULATOR.weeksPerYear} semanas laborales al año.
        </p>

        <Magnet className="mt-7">
          <a href="#contacto" className={btn("primary")}>
            Quiero recuperar ese tiempo <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Magnet>
      </div>
    </div>
  );
};

export default Calculator;
