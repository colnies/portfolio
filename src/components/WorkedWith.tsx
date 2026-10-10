import { companies } from "@/data/companies";
import { Row } from "@/components/Row";

export function WorkedWith() {
  return (
    <Row label="Worked with" heading>
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
    </Row>
  );
}
