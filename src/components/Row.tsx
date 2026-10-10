import type { ReactNode } from "react";

interface RowProps {
  label: string;
  children: ReactNode;
  /** Real sections get a heading; hero facts get a plain label */
  heading?: boolean;
  id?: string;
}

/** Label in a narrow left column, content beside it; stacks on mobile. */
export function Row({ label, children, heading = false, id }: RowProps) {
  const Label = heading ? "h2" : "p";
  return (
    <div className="grid gap-3 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      <Label
        id={id}
        className="text-xs uppercase tracking-widest text-muted-foreground md:pt-1.5"
      >
        {label}
      </Label>
      <div>{children}</div>
    </div>
  );
}
