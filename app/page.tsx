import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Hero } from '@/components/site/Hero';
import { About } from '@/components/site/About';
import { Capabilities } from '@/components/site/Capabilities';
import { Process } from '@/components/site/Process';
import { ProjectRegister } from '@/components/site/ProjectRegister';
import { ContactCTA } from '@/components/site/ContactCTA';
import {
  getCompanySettings,
  getPublishedProjects,
  getEnabledCapabilities,
  getEnabledProcessStages,
} from '@/lib/data';

export default async function Home() {
  const [settings, projects, capabilities, processStages] = await Promise.all([
    getCompanySettings(),
    getPublishedProjects(),
    getEnabledCapabilities(),
    getEnabledProcessStages(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Capabilities capabilities={capabilities} />
        <ProjectRegister projects={projects} />
        <Process stages={processStages} />
        <ContactCTA settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
