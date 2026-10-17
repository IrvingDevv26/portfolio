import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useContent } from "../lib/i18n";
import CodeSlots from "./reactbits/CodeSlots";
import ThoughtLine from "./reactbits/ThoughtLine";
import { Eyebrow } from "./shared";

/* Easter egg: el PIN impreso en el reverso de la credencial 3D abre un
   panel con cómo está construido el sitio. */

const DevMode = () => {
  const { DEV_MODE, UI } = useContent();
  const words = UI.devMode;
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)] p-6 md:p-8">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <Eyebrow>{words.eyebrow}</Eyebrow>
          <p className="mt-3 font-display text-xl font-semibold text-[color:var(--text)]">
            {DEV_MODE.title}
          </p>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[color:var(--muted)]">
            {DEV_MODE.hint}
          </p>
        </div>

        <CodeSlots
          length={DEV_MODE.pin.length}
          status={status}
          onChange={() => status === "error" && setStatus("idle")}
          onComplete={(code) =>
            setStatus(code === DEV_MODE.pin ? "success" : "error")
          }
          ariaLabel={words.pin}
          accentColor="#D4B27A"
          inkColor="#F1F3F6"
          slotColor="#16181E"
          digitColor="#08090C"
          dangerColor="#F2906B"
          slotSize={48}
        />
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <ThoughtLine
                label={words.checking}
                doneLabel={words.granted}
                steps={words.steps}
                settleAfter={1.4}
                collapseOnSettle={false}
                onSettle={() => setUnlocked(true)}
                color="#BCC1CB"
                glyphColor="#D4B27A"
                fontSize={14}
              />

              <AnimatePresence>
                {unlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-5 overflow-hidden rounded-xl border border-[color:var(--line)] bg-[#06070A] font-mono text-sm"
                  >
                    <p className="border-b border-[color:var(--line)] px-5 py-2.5 text-xs text-[color:var(--muted)]">
                      dev@portfolio: ~/build
                    </p>
                    <dl className="grid gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[auto_1fr]">
                      {DEV_MODE.build.map(([key, value]) => (
                        <div key={key} className="contents">
                          <dt className="text-[color:var(--accent)]">
                            {key.toLowerCase()}
                          </dt>
                          <dd className="text-[color:var(--soft)] max-sm:mb-2">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="border-t border-[color:var(--line)] px-5 py-2.5 text-xs text-[color:var(--muted)]">
                      {words.thanks}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevMode;
