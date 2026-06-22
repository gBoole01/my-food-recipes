export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-error-border bg-error-bg p-4" role="alert">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 flex-none text-error"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <div className="text-sm text-error">
        <p className="font-bold">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="mt-1 min-h-11 font-bold underline">
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
