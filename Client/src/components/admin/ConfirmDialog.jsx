import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((opts) => {
    setState(typeof opts === "string" ? { message: opts } : opts);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  function settle(result) {
    resolverRef.current?.(result);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {state && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
              onClick={() => settle(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-2xl shadow-elevated w-full max-w-sm p-6 text-center"
            >
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  state.danger ? "bg-red-50 text-red-600" : "bg-accent/10 text-accent"
                }`}
              >
                <i className={`fa-solid ${state.icon || (state.danger ? "fa-trash-can" : "fa-circle-question")}`} />
              </div>
              <h3 className="font-semibold text-primary mb-1.5">{state.title || "Are you sure?"}</h3>
              <p className="text-sm text-primary/55">{state.message}</p>
              <div className="flex gap-2.5 mt-6">
                <button onClick={() => settle(false)} className="admin-btn-ghost flex-1">
                  {state.cancelLabel || "Cancel"}
                </button>
                <button
                  onClick={() => settle(true)}
                  className={`admin-btn flex-1 text-white ${state.danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-accent"}`}
                >
                  {state.confirmLabel || "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
