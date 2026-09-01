import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ProjectRegister } from '@/components/site/ProjectRegister';
import { getPublishedProjects, getCompanySettings } from '@/lib/data';

export async function generateMetadata() {
  const settings = await getCompanySettings();
  return {
    title: 'Projects',
    description: `Project register — ${settings.company_name}`,
  };
}

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getPublishedProjects(),
    getCompanySettings(),
  ]);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="section-padding-lg pt-16 md:pt-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm">ALL PROJECTS</span>
          </div>
          <h1 className="font-display text-display-lg font-bold tracking-tightest text-graphite leading-[0.9] mb-4">
            PROJECT
            <br />
            <span className="text-foreground/30">REGISTER.</span>
          </h1>
          <p className="max-w-md text-sm text-foreground/50 leading-relaxed mb-16">
            A record of metal construction and steel fabrication work delivered by {settings.company_name}.
          </p>
        </div>
        <ProjectRegister projects={projects} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
