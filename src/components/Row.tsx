import type { ReactNode } from "react";

interface RowProps {
  label: string;
  children: ReactNode;
  id?: string;
}

/** Section heading in a narrow left column, content beside it; stacks on mobile. */
export function Row({ label, children, id }: RowProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      <h2
        id={id}
        className="text-xs uppercase tracking-widest text-muted-foreground md:pt-1.5"
      >
        {label}
      </h2>
      <div>{children}</div>
    </div>
  );
}
