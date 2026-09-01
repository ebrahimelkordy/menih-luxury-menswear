import type { Project } from '@/lib/types';

interface ProjectMetadataProps {
  project: Project;
}

export function ProjectMetadata({ project }: ProjectMetadataProps) {
  const items = [
    { label: 'LOCATION', value: project.location },
    { label: 'YEAR', value: project.year },
    { label: 'STATUS', value: project.status },
    { label: 'CATEGORY', value: project.category },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <div className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-foreground/15">
      {items.map((item) => (
        <div key={item.label} className="py-4 md:py-5 pr-4 border-r border-foreground/10 last:border-r-0">
          <div className="tech-label-sm text-foreground/40 mb-1">{item.label}</div>
          <div className="text-sm md:text-base text-foreground/80 tech-number font-mono">
            {item.value.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}
