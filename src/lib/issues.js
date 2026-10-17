import { useMemo } from "react";
import { useContent } from "./i18n";
import { ISSUE_TYPES, ISSUES } from "./sheet";

/** Cada tipo de problema con su color, nombre y explicación en el idioma actual. */
export const useIssues = () => {
  const { ISSUE_TEXT } = useContent();
  return useMemo(
    () =>
      Object.fromEntries(
        ["all", ...ISSUE_TYPES].map((type) => [
          type,
          { ...ISSUES[type], ...ISSUE_TEXT[type] },
        ]),
      ),
    [ISSUE_TEXT],
  );
};
