'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { StatCard } from '@/components/admin/AdminUI';
import Link from 'next/link';
import { FolderKanban, Wrench, GitBranch, ArrowRight } from 'lucide-react';

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  capabilities: number;
  processStages: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [projects, caps, stages] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('capabilities').select('*'),
        supabase.from('process_stages').select('*'),
      ]);

      const allProjects = projects.data ?? [];
      setStats({
        totalProjects: allProjects.length,
        publishedProjects: allProjects.filter((p) => p.published).length,
        draftProjects: allProjects.filter((p) => !p.published).length,
        capabilities: caps.data?.length ?? 0,
        processStages: stages.data?.length ?? 0,
      });
      setRecentProjects(allProjects.slice(0, 5));
    })();
  }, []);

  if (!stats) {
    return <div className="tech-label-sm text-foreground/40">LOADING...</div>;
  }

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block w-1.5 h-1.5 bg-safety" />
          <span className="tech-label-sm text-foreground/40">DASHBOARD</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tightest text-graphite">
          OVERVIEW
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
        <StatCard label="TOTAL PROJECTS" value={stats.totalProjects} />
        <StatCard label="PUBLISHED" value={stats.publishedProjects} accent />
        <StatCard label="DRAFTS" value={stats.draftProjects} />
        <StatCard label="CAPABILITIES" value={stats.capabilities} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-12">
        <Link href="/admin/projects" className="group bg-white border border-foreground/10 p-5 hover:border-safety transition-colors">
          <FolderKanban className="w-5 h-5 text-foreground/40 group-hover:text-safety transition-colors mb-4" />
          <div className="font-display text-lg font-medium text-graphite">PROJECTS</div>
          <div className="text-sm text-foreground/40 mt-1">Create, edit, publish projects</div>
          <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-safety mt-3 transition-colors" />
        </Link>
        <Link href="/admin/capabilities" className="group bg-white border border-foreground/10 p-5 hover:border-safety transition-colors">
          <Wrench className="w-5 h-5 text-foreground/40 group-hover:text-safety transition-colors mb-4" />
          <div className="font-display text-lg font-medium text-graphite">CAPABILITIES</div>
          <div className="text-sm text-foreground/40 mt-1">Manage services list</div>
          <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-safety mt-3 transition-colors" />
        </Link>
        <Link href="/admin/process" className="group bg-white border border-foreground/10 p-5 hover:border-safety transition-colors">
          <GitBranch className="w-5 h-5 text-foreground/40 group-hover:text-safety transition-colors mb-4" />
          <div className="font-display text-lg font-medium text-graphite">PROCESS</div>
          <div className="text-sm text-foreground/40 mt-1">Edit build stages</div>
          <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-safety mt-3 transition-colors" />
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block w-1.5 h-1.5 bg-safety" />
          <span className="tech-label-sm text-foreground/40">RECENT ACTIVITY</span>
        </div>
        <div className="bg-white border border-foreground/10">
          {recentProjects.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-foreground/40">No projects yet.</p>
              <Link href="/admin/projects/new" className="mt-3 inline-block tech-label-sm text-safety hover:underline">
                CREATE FIRST PROJECT →
              </Link>
            </div>
          ) : (
            recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex items-center justify-between px-5 py-4 border-b border-foreground/5 last:border-b-0 hover:bg-concrete-50/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className={`inline-block w-2 h-2 ${project.published ? 'bg-safety' : 'bg-foreground/20'}`} />
                  <span className="text-sm font-medium text-graphite">{project.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="tech-label-sm text-foreground/40">
                    {project.published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                  <span className="text-sm text-foreground/30 group-hover:text-safety transition-colors">→</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
