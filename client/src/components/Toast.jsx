export default function Toast({ type = "info", message, onClose }) {
  if (!message) {
    return null;
  }

  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700"
  };

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-50">
      <div
        className={`pointer-events-auto flex min-w-[240px] items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg ${
          styles[type] || styles.info
        }`}
      >
        <span className="font-semibold">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-xs font-semibold uppercase tracking-wide"
        >
          Close
        </button>
      </div>
    </div>
  );
}
