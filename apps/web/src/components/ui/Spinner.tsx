export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-[3px] border-surface-alt border-t-primary"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Chargement"
    />
  );
}
