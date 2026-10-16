import { useCallback, useState } from "react";
import { ToastContext } from "../lib/toast";
import { CheckIcon } from "./icons";
import SwipeToast from "./reactbits/SwipeToast";

/* Avisos breves (SwipeToast de React Bits). Se pueden descartar deslizando. */

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const notify = useCallback((title, description = "") => {
    setToast({ id: Date.now(), title, description });
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {toast && (
        <SwipeToast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          icon={<CheckIcon className="h-4 w-4 text-[color:var(--clean)]" />}
          onClose={() => setToast(null)}
          background="#16181E"
          color="#F1F3F6"
          fuseColor="#D4B27A"
          duration={3500}
        />
      )}
    </ToastContext.Provider>
  );
};
