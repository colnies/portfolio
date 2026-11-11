import { companies } from "@/data/companies";
import { Row } from "@/components/Row";

export function WorkedWith() {
  return (
    <Row label="Worked at">
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        {companies.map((company) => (
          <li key={company} className="whitespace-nowrap text-muted-foreground">
            {company}
          </li>
        ))}
      </ul>
    </Row>
  );
}
