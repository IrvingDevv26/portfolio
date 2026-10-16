import { createContext, useContext } from "react";

/* Contexto de avisos: el proveedor vive en components/Toast.jsx.
   Uso: const notify = useToast(); notify("Correo copiado", "detalle opcional"); */
export const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);
