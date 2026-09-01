import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { StructuralLine } from '@/components/site/StructuralLine';
import { getProjectBySlug, getRelatedProjects, getCompanySettings } from '@/lib/data';
import { ProjectGallery } from '@/components/site/ProjectGallery';
import { ProjectMetadata } from '@/components/site/ProjectMetadata';
import { RelatedProjects } from '@/components/site/RelatedProjects';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.description || `${project.title} — ${project.category}`,
    openGraph: {
      title: project.title,
      description: project.description || `${project.title} — ${project.category}`,
      images: project.main_image ? [{ url: project.main_image.url }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, settings] = await Promise.all([
    getProjectBySlug(params.slug),
    getCompanySettings(),
  ]);

  if (!project) notFound();

  const related = await getRelatedProjects(project.id, project.category);

  const projectNumber = project.sort_order > 0
    ? project.sort_order.toString().padStart(3, '0')
    : '—';

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header — technical document style */}
        <section className="section-padding-lg pt-12 md:pt-20 pb-12 md:pb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm">PROJECT № {projectNumber}</span>
            <StructuralLine className="flex-1 max-w-32" />
            <Link href="/#projects" className="tech-label-sm text-foreground/40 hover:text-safety transition-colors">
              ← BACK
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-display text-display-md font-bold tracking-tightest text-graphite leading-[0.9]">
                {project.title.toUpperCase()}
              </h1>
              {project.category && (
                <p className="mt-4 tech-label text-foreground/50">
                  {project.category.toUpperCase()}
                </p>
              )}
            </div>
          </div>

          {/* Metadata grid */}
          <ProjectMetadata project={project} />
        </section>

        {/* Main image */}
        {project.main_image && (
          <section className="section-padding-lg mb-12 md:mb-20">
            <div className="relative aspect-[16/9] overflow-hidden">
              <div className="absolute -top-2 -left-2 w-5 h-px bg-safety z-10" />
              <div className="absolute -top-2 -left-2 h-5 w-px bg-safety z-10" />
              <div className="absolute -bottom-2 -right-2 w-5 h-px bg-safety z-10" />
              <div className="absolute -bottom-2 -right-2 h-5 w-px bg-safety z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.main_image.url}
                alt={project.main_image.alt || project.title}
                className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.95]"
              />
            </div>
            {project.main_image.alt && (
              <div className="mt-3 flex items-center gap-3">
                <span className="tech-label-sm text-safety">FIG.01</span>
                <span className="tech-label-sm text-foreground/40">{project.main_image.alt.toUpperCase()}</span>
              </div>
            )}
          </section>
        )}

        {/* Description */}
        {project.description && (
          <section className="section-padding-lg py-12 md:py-20 border-t border-foreground/10">
            <div className="grid grid-cols-12 gap-6 md:gap-8">
              <div className="col-span-12 md:col-span-3">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-1.5 h-1.5 bg-safety" />
                  <span className="tech-label-sm">DESCRIPTION</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-8 lg:col-span-7">
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Technical info */}
        {(project.weight || project.span || project.structure_type) && (
          <section className="section-padding-lg py-12 md:py-20 border-t border-foreground/10 bg-concrete-50/50">
            <div className="grid grid-cols-12 gap-6 md:gap-8">
              <div className="col-span-12 md:col-span-3">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-1.5 h-1.5 bg-safety" />
                  <span className="tech-label-sm">TECHNICAL INFO</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
                  {project.weight && (
                    <div className="py-4 border-t border-foreground/15">
                      <div className="tech-label-sm text-foreground/40 mb-2">WEIGHT</div>
                      <div className="font-display text-2xl font-medium text-graphite tech-number">{project.weight}</div>
                    </div>
                  )}
                  {project.span && (
                    <div className="py-4 border-t border-foreground/15">
                      <div className="tech-label-sm text-foreground/40 mb-2">SPAN</div>
                      <div className="font-display text-2xl font-medium text-graphite tech-number">{project.span}</div>
                    </div>
                  )}
                  {project.structure_type && (
                    <div className="py-4 border-t border-foreground/15">
                      <div className="tech-label-sm text-foreground/40 mb-2">STRUCTURE TYPE</div>
                      <div className="font-display text-2xl font-medium text-graphite">{project.structure_type}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        {project.images.length > 1 && (
          <ProjectGallery images={project.images} />
        )}

        {/* Execution info */}
        {project.execution_info && (
          <section className="section-padding-lg py-12 md:py-20 border-t border-foreground/10">
            <div className="grid grid-cols-12 gap-6 md:gap-8">
              <div className="col-span-12 md:col-span-3">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-1.5 h-1.5 bg-safety" />
                  <span className="tech-label-sm">EXECUTION</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-8 lg:col-span-7">
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  {project.execution_info}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Related projects */}
        {related.length > 0 && (
          <RelatedProjects projects={related} />
        )}

        {/* Final CTA */}
        <section className="section-padding-lg py-20 md:py-32 bg-graphite text-concrete">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-concrete/50">NEXT PROJECT</span>
          </div>
          <Link
            href="/#contact"
            className="group inline-flex items-baseline gap-4"
          >
            <h2 className="font-display text-display-sm font-bold tracking-tightest text-concrete group-hover:text-safety transition-colors duration-300">
              {settings.final_cta_title}
            </h2>
            <span className="inline-block w-8 h-px bg-safety transition-all duration-300 group-hover:w-16" />
          </Link>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
