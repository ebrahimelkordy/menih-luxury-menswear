import Link from 'next/link';
import type { Project } from '@/lib/types';

interface RelatedProjectsProps {
  projects: Project[];
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="section-padding-lg py-12 md:py-20 border-t border-foreground/10">
      <div className="flex items-center gap-3 mb-10">
        <span className="inline-block w-1.5 h-1.5 bg-safety" />
        <span className="tech-label-sm">RELATED PROJECTS</span>
      </div>

      <div className="space-y-0">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group block border-b border-foreground/10 last:border-b-0"
          >
            <div className="grid grid-cols-12 gap-4 items-center py-5 transition-all duration-300 group-hover:pl-4">
              <span className="col-span-1 tech-label-sm text-safety font-mono tech-number">
                {String(i + 1).padStart(3, '0')}
              </span>
              <span className="col-span-7 md:col-span-6 font-display text-lg md:text-2xl font-medium tracking-tight text-foreground/60 group-hover:text-graphite transition-colors">
                {project.title.toUpperCase()}
              </span>
              <span className="hidden md:block col-span-3 text-sm text-foreground/40">
                {project.category || '—'}
              </span>
              <span className="col-span-4 md:col-span-2 text-right text-foreground/30 group-hover:text-safety transition-colors">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
