// A bar showing a value from 0 to 1 (ADR 0002). It's hidden from screen readers, so the
// value must also be in text beside it, as in a ListRow's detail. Not the native <meter>:
// styling that needs a different pseudo-element in each engine, and it would read the
// value aloud a second time next to the text.

interface MeterProps {
  /** From 0 to 1. Values outside that are clamped, and NaN draws an empty bar. */
  value: number;
}

export function Meter({ value }: MeterProps) {
  // `|| 0` turns NaN into 0. An invalid width would be ignored, leaving the bar full.
  const percent = Math.min(1, Math.max(0, value || 0)) * 100;
  return (
    <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
    </div>
  );
}
