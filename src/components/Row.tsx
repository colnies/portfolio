import type { ReactNode } from "react";

interface RowProps {
  label: string;
  children: ReactNode;
  id?: string;
}

/** Section heading stacked above its content. */
export function Row({ label, children, id }: RowProps) {
  return (
    <div className="space-y-3">
      <h2
        id={id}
        className="text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </h2>
      <div>{children}</div>
    </div>
  );
}
