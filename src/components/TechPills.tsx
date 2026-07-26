export function TechPills({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t} className="pill">
          {t}
        </li>
      ))}
    </ul>
  );
}
