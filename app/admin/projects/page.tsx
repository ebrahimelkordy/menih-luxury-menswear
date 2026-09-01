'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { AdminButton, EmptyState, LoadingState } from '@/components/admin/AdminUI';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/lib/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setProjects(data ?? []);
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  };

  const togglePublished = async (project: Project) => {
    await supabase.from('projects').update({ published: !project.published }).eq('id', project.id);
    loadProjects();
  };

  const toggleFeatured = async (project: Project) => {
    await supabase.from('projects').update({ featured: !project.featured }).eq('id', project.id);
    loadProjects();
  };

  if (loading) return <LoadingState label="LOADING PROJECTS" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">CMS</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tightest text-graphite">
            PROJECTS
          </h1>
        </div>
        <AdminButton onClick={() => router.push('/admin/projects/new')}>
          <Plus className="w-4 h-4" />
          NEW PROJECT
        </AdminButton>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to display it on the website."
          action={<AdminButton onClick={() => router.push('/admin/projects/new')}><Plus className="w-4 h-4" /> CREATE PROJECT</AdminButton>}
        />
      ) : (
        <div className="bg-white border border-foreground/10 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="text-left px-5 py-3 tech-label-sm text-foreground/40">№</th>
                <th className="text-left px-5 py-3 tech-label-sm text-foreground/40">TITLE</th>
                <th className="text-left px-5 py-3 tech-label-sm text-foreground/40 hidden md:table-cell">CATEGORY</th>
                <th className="text-left px-5 py-3 tech-label-sm text-foreground/40 hidden md:table-cell">YEAR</th>
                <th className="text-left px-5 py-3 tech-label-sm text-foreground/40">STATUS</th>
                <th className="text-right px-5 py-3 tech-label-sm text-foreground/40">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr key={project.id} className="border-b border-foreground/5 last:border-b-0 hover:bg-concrete-50/50 transition-colors">
                  <td className="px-5 py-4 tech-number text-sm text-foreground/40 font-mono">
                    {String(i + 1).padStart(3, '0')}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/projects/${project.id}`} className="text-sm font-medium text-graphite hover:text-safety transition-colors">
                      {project.title}
                    </Link>
                    {project.featured && <span className="ml-2 text-safety text-xs">★</span>}
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground/40 hidden md:table-cell">{project.category || '—'}</td>
                  <td className="px-5 py-4 text-sm text-foreground/40 hidden md:table-cell tech-number font-mono">{project.year || '—'}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => togglePublished(project)}
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      title={project.published ? 'Unpublish' : 'Publish'}
                    >
                      {project.published ? (
                        <><Eye className="w-3.5 h-3.5 text-safety" /><span className="text-safety">PUBLISHED</span></>
                      ) : (
                        <><EyeOff className="w-3.5 h-3.5 text-foreground/30" /><span className="text-foreground/30">DRAFT</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleFeatured(project)} title="Toggle featured" className="p-1.5 hover:text-safety transition-colors">
                        <Star className={`w-4 h-4 ${project.featured ? 'text-safety fill-safety' : 'text-foreground/30'}`} />
                      </button>
                      <Link href={`/admin/projects/${project.id}`} className="p-1.5 hover:text-safety transition-colors" title="Edit">
                        <Pencil className="w-4 h-4 text-foreground/40" />
                      </Link>
                      <button onClick={() => handleDelete(project.id, project.title)} className="p-1.5 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-foreground/40" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
