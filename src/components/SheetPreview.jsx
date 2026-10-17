import { useMemo, useState } from "react";
import { useContent } from "../lib/i18n";
import { useIssues } from "../lib/issues";
import { ISSUE_TYPES, ISSUES } from "../lib/sheet";
import { focusRing } from "../lib/ui";
import AnimatedList from "./reactbits/AnimatedList";
import CountUp from "./reactbits/CountUp";

/* Vista previa de una hoja con sus problemas resaltados, la lista de problemas
   detectados (AnimatedList de React Bits) y las cifras del diagnóstico. */

/* ── Cifras ───────────────────────────────────────────────── */

export const Stat = ({ value, label, detail, accent = false }) => (
  <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--glass)] px-4 py-3.5">
    <p
      className={`font-display text-3xl font-semibold tracking-tight ${
        accent ? "text-[color:var(--accent)]" : "text-[color:var(--text)]"
      }`}
    >
      <CountUp to={value} duration={1.2} />
    </p>
    <p className="mt-1 text-sm text-[color:var(--soft)]">{label}</p>
    {detail && (
      <p className="mt-0.5 text-xs text-[color:var(--muted)]">{detail}</p>
    )}
  </div>
);

/* ── Lista de problemas ───────────────────────────────────── */

// Colores de la lista acordes a la paleta del sitio
const LIST_THEME = {
  "--al-frame": "rgba(255,255,255,0.02)",
  "--al-frame-edge": "rgba(255,255,255,0.08)",
  "--al-frame-highlight": "rgba(255,255,255,0.04)",
  "--al-frame-shadow": "none",
  "--al-tile": "linear-gradient(180deg, #171a21 0%, #12141a 100%)",
  "--al-tile-edge": "rgba(255,255,255,0.06)",
  "--al-tile-highlight": "rgba(255,255,255,0.06)",
  "--al-tile-shadow": "none",
  "--al-well": "rgba(255,255,255,0.05)",
  "--al-ink": "#F1F3F6",
  "--al-muted": "#8A909C",
  "--al-thumb": "rgba(255,255,255,0.14)",
};

export const IssueList = ({ analysis, onFocus }) => {
  const issues = useIssues();
  // El primer elemento muestra todos los problemas a la vez
  const items = useMemo(
    () => [
      {
        id: "all",
        ...issues.all,
        color: "#F1F3F6",
        count: analysis.total,
      },
      ...ISSUE_TYPES.filter((t) => analysis.counts[t] > 0).map((t) => ({
        id: t,
        ...issues[t],
        count: analysis.counts[t],
      })),
    ],
    [analysis, issues],
  );

  return (
    <AnimatedList
      items={items}
      initialSelectedIndex={0}
      selectOnHover={false}
      onItemSelect={(item) => onFocus(item.id === "all" ? null : item.id)}
      animation="pop"
      stagger={0.06}
      width="100%"
      maxHeight={420}
      radius={12}
      gap={6}
      displayScrollbar={false}
      accentColor="#D4B27A"
      style={LIST_THEME}
      renderItem={(item) => (
        <>
          <span className="animated-list__lead" aria-hidden="true">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 12px ${item.color}80`,
              }}
            />
          </span>
          <span className="animated-list__text">
            <span className="animated-list__title">{item.label}</span>
            <span className="animated-list__description">{item.hint}</span>
          </span>
          <span className="animated-list__meta font-mono">{item.count}</span>
        </>
      )}
    />
  );
};

/* ── Tabla ────────────────────────────────────────────────── */

const PREVIEW_ROWS = 8;
const MAX_ROWS = 60;

// Los espacios sobrantes se ven como puntos
const Visible = ({ value }) =>
  value.split(/(^ +| +$| {2,})/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="text-[color:var(--accent)]">
        {"·".repeat(part.length)}
      </span>
    ) : (
      part
    ),
  );

const Cell = ({ value, types, focus, issues, emptyLabel }) => {
  const shown = types.filter((t) => focus === null || t === focus);
  const color = shown.length ? ISSUES[shown[0]].color : null;
  return (
    <td
      title={shown.map((t) => issues[t].label).join(" · ") || undefined}
      className="max-w-[16rem] truncate whitespace-nowrap px-3 py-2 text-[color:var(--soft)]"
      style={
        color
          ? {
              backgroundColor: `${color}1F`,
              boxShadow: `inset 0 -2px 0 ${color}B3`,
              color: "var(--text)",
            }
          : undefined
      }
    >
      {types.includes("empty") ? (
        <span className="italic text-[color:var(--muted)]">
          {value.trim() || emptyLabel}
        </span>
      ) : (
        <Visible value={value} />
      )}
    </td>
  );
};

export const PreviewTable = ({
  analysis,
  focus = null,
  caption,
  scanning = false,
  footer = true,
}) => {
  const { SHEET_PREVIEW: words } = useContent();
  const issues = useIssues();
  const [expanded, setExpanded] = useState(false);
  const { headers, rows, flags, dupRows } = analysis;

  const matching = rows
    .map((_, r) => r)
    .filter(
      (r) =>
        focus === null ||
        (focus === "dup"
          ? dupRows.has(r)
          : flags[r].some((types) => types.includes(focus))),
    );
  const shown = matching.slice(0, expanded ? MAX_ROWS : PREVIEW_ROWS);
  const showDup = focus === null || focus === "dup";

  return (
    <figure className="min-w-0">
      <div className="relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="border-b border-[color:var(--line)] bg-[color:var(--glass)]">
                <th
                  scope="col"
                  className="w-12 px-3 py-2.5 font-mono text-[11px] font-normal text-[color:var(--muted)]"
                >
                  #
                </th>
                {headers.map((h, c) => (
                  <th
                    key={`${h}-${c}`}
                    scope="col"
                    className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] font-medium uppercase tracking-wider text-[color:var(--muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const dup = showDup && dupRows.has(r);
                return (
                  <tr
                    key={r}
                    className="border-b border-[color:var(--line)] last:border-0"
                    style={
                      dup
                        ? {
                            backgroundColor: "rgba(255,154,168,0.07)",
                            boxShadow: `inset 3px 0 0 ${ISSUES.dup.color}`,
                          }
                        : undefined
                    }
                  >
                    <td
                      className="px-3 py-2 font-mono text-[11px] text-[color:var(--muted)]"
                      title={dup ? issues.dup.label : undefined}
                    >
                      {r + 1}
                      {dup && (
                        <span style={{ color: ISSUES.dup.color }}> ↺</span>
                      )}
                    </td>
                    {rows[r].map((value, c) => (
                      <Cell
                        key={c}
                        value={value}
                        types={flags[r][c]}
                        issues={issues}
                        emptyLabel={words.empty}
                        focus={focus}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {scanning && <span aria-hidden="true" className="scan-line" />}
      </div>

      {footer && (
        <figcaption className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-[color:var(--muted)]">
          <span>
            {words.shown(
              shown.length,
              matching.length,
              rows.length,
              focus ? issues[focus].label : "",
            )}
            {analysis.counts.spaces > 0 && (
              <span className="max-sm:hidden">{words.spaces}</span>
            )}
          </span>
          {matching.length > PREVIEW_ROWS && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={`rounded font-medium text-[color:var(--accent)] underline-offset-4 hover:underline ${focusRing}`}
            >
              {expanded ? words.less : words.more}
            </button>
          )}
        </figcaption>
      )}
    </figure>
  );
};
