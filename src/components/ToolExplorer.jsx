import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useContent } from "../lib/i18n";
import BranchedMenu from "./reactbits/BranchedMenu";
import SpotlightCard from "./reactbits/SpotlightCard";

/* Explorador de herramientas: el árbol (BranchedMenu) elige la herramienta
   y la ficha de la derecha explica para qué la uso. */

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const treeOf = (stack) =>
  stack.map(({ area, items }) => ({
    label: area,
    children: items.map((tool) => ({
      value: slug(tool.name),
      label: tool.name,
    })),
  }));

const toolsOf = (stack) =>
  Object.fromEntries(
    stack.flatMap(({ area, items }) =>
      items.map((tool) => [slug(tool.name), { ...tool, area }]),
    ),
  );

const ToolExplorer = () => {
  const { STACK } = useContent();
  const TREE = treeOf(STACK);
  const OPEN_ALL = TREE.map((_, i) => i);
  const [selected, setSelected] = useState(TREE[0].children[0].value);
  const tool = toolsOf(STACK)[selected];

  return (
    <div className="grid gap-8 sm:grid-cols-[minmax(0,12.5rem)_1fr] sm:items-start">
      <BranchedMenu
        items={TREE}
        defaultOpen={OPEN_ALL}
        defaultActive={selected}
        onSelect={(value) => setSelected(value)}
        color="#F1F3F6"
        accentColor="#D4B27A"
        lineColor="rgba(255,255,255,0.16)"
        width={200}
        fontSize={14}
      />

      <SpotlightCard className="min-h-[13rem] rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)] p-6 sm:sticky sm:top-28">
        <div aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {tool.area}
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-[color:var(--text)]">
                {tool.name}
              </p>
              <p className="mt-3 leading-relaxed text-[color:var(--soft)]">
                {tool.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default ToolExplorer;
