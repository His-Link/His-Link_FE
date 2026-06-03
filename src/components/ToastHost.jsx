import { useEffect, useState } from "react";
import { TOAST_EVENT } from "utils/toast";
import "styles/Toast.css";

function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (event) => {
      const { id, message, variant, durationMs } = event.detail;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, durationMs);
    };

    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-item--${toast.variant}`}
          role="status"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastHost;
