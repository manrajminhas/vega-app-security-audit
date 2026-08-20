import React, { createContext, useContext, useState, useCallback } from 'react';
import '../App.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message, duration = 3000) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          data-testid="toast"
          className={`toast-msg ${toast.type}`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};