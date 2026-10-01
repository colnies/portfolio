import { companies } from "@/data/companies";

export function WorkedWith() {
  return (
    <div>
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Worked With
      </h2>
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        {companies.map((company) => (
          <li
            key={company}
            className="whitespace-nowrap text-sm text-muted-foreground/60"
          >
            {company}
          </li>
        ))}
      </ul>
    </div>
  );
}
