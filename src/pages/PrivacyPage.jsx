import { LabHeader } from "../components/LabParts";
import PageFooter from "../components/PageFooter";
import { PRIVACY_ADDRESS } from "../content/contact";
import { useDocumentTitle } from "../lib/hooks";
import { useMarkSalesMode } from "../lib/salesMode";
import { useContent } from "../lib/i18n";
import { focusRing } from "../lib/ui";

/* Aviso de privacidad (/privacidad y /en/privacidad). Los textos están en
   PRIVACY (content) y el domicilio en src/content/contact.js. */

// "{email}" dentro de un texto se vuelve un enlace al correo
const WithEmail = ({ text, email }) => {
  const [before, after] = text.split("{email}");
  if (after === undefined) return text;
  return (
    <>
      {before}
      <a
        href={`mailto:${email}`}
        className={`rounded text-[color:var(--text)] underline underline-offset-4 ${focusRing}`}
      >
        {email}
      </a>
      {after}
    </>
  );
};

const PrivacyPage = () => {
  const { PRIVACY, PROFILE } = useContent();
  useDocumentTitle(`${PRIVACY.title} · ${PROFILE.shortName}`);
  useMarkSalesMode();

  return (
    <div className="grain font-body min-h-screen bg-[color:var(--ink)] text-[color:var(--text)]">
      <LabHeader badge={false} site />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-14 md:px-10 md:pt-20">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {PRIVACY.title}
        </h1>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          {PRIVACY.updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-[color:var(--soft)]">
          {PRIVACY.intro(PROFILE.name, PRIVACY_ADDRESS || PRIVACY.pending)}
        </p>

        {PRIVACY.sections.map((section) => (
          <section key={section.title} className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-[color:var(--text)]">
              {section.title}
            </h2>
            {section.text && (
              <p className="mt-4 leading-relaxed text-[color:var(--soft)]">
                {section.text}
              </p>
            )}
            <ul className="mt-4 space-y-3 leading-relaxed text-[color:var(--soft)]">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]"
                  />
                  <span>
                    <WithEmail text={item} email={PROFILE.email} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <PageFooter />
    </div>
  );
};

export default PrivacyPage;
