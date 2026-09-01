'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { AdminButton, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminUI';
import type { Project, ProjectImage } from '@/lib/types';
import { Loader2, Save, Trash2, Plus, X, Star, Upload } from 'lucide-react';

interface ProjectFormProps {
  project?: Project | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<ProjectImage[]>([]);

  const [form, setForm] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    category: project?.category ?? '',
    location: project?.location ?? '',
    year: project?.year ?? '',
    status: project?.status ?? 'draft',
    description: project?.description ?? '',
    weight: project?.weight ?? '',
    span: project?.span ?? '',
    structure_type: project?.structure_type ?? '',
    execution_info: project?.execution_info ?? '',
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    sort_order: project?.sort_order ?? 0,
  });

  useEffect(() => {
    if (project) {
      loadImages(project.id);
    }
  }, [project]);

  const loadImages = async (projectId: string) => {
    const { data } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    setImages(data ?? []);
  };

  const updateForm = (key: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError(null);
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    const slug = form.slug.trim() || slugify(form.title);
    const payload = { ...form, slug };

    if (project) {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', project.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      router.push('/admin/projects');
    } else {
      const { data, error: insertError } = await supabase
        .from('projects')
        .insert(payload)
        .select()
        .maybeSingle();
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
      router.push(`/admin/projects/${data?.id}`);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from('projects').delete().eq('id', project.id);
    router.push('/admin/projects');
  };

  const handleAddImage = async () => {
    if (!project || !imageUrl.trim()) return;
    const { data, error: imgError } = await supabase
      .from('project_images')
      .insert({
        project_id: project.id,
        url: imageUrl.trim(),
        alt: '',
        sort_order: images.length,
        is_main: images.length === 0,
      })
      .select()
      .maybeSingle();
    if (!imgError && data) {
      setImages([...images, data]);
      setImageUrl('');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    await supabase.from('project_images').delete().eq('id', imageId);
    if (project) loadImages(project.id);
  };

  const handleSetMain = async (imageId: string) => {
    if (!project) return;
    await supabase.from('project_images').update({ is_main: false }).eq('project_id', project.id);
    await supabase.from('project_images').update({ is_main: true }).eq('id', imageId);
    loadImages(project.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">{project ? 'EDIT PROJECT' : 'NEW PROJECT'}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tightest text-graphite">
            {form.title || 'UNTITLED'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {project && (
            <AdminButton variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              DELETE
            </AdminButton>
          )}
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            SAVE
          </AdminButton>
        </div>
      </div>

      {error && (
        <div className="border-l-2 border-safety px-4 py-3 bg-safety/5 mb-6">
          <p className="text-sm text-safety">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-foreground/10 p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block w-1.5 h-1.5 bg-safety" />
              <span className="tech-label-sm text-foreground/40">BASIC INFO</span>
            </div>
            <AdminInput label="TITLE" value={form.title} onChange={(v) => updateForm('title', v)} required placeholder="Industrial Hall" />
            <AdminInput label="SLUG" value={form.slug} onChange={(v) => updateForm('slug', v)} placeholder="auto-generated from title" />
            <AdminTextarea label="DESCRIPTION" value={form.description} onChange={(v) => updateForm('description', v)} rows={5} placeholder="Project description..." />
            <AdminTextarea label="EXECUTION INFO" value={form.execution_info} onChange={(v) => updateForm('execution_info', v)} rows={3} placeholder="Execution and construction details..." />
          </div>

          <div className="bg-white border border-foreground/10 p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block w-1.5 h-1.5 bg-safety" />
              <span className="tech-label-sm text-foreground/40">TECHNICAL INFO</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="CATEGORY" value={form.category} onChange={(v) => updateForm('category', v)} placeholder="Industrial Hall" />
              <AdminInput label="LOCATION" value={form.location} onChange={(v) => updateForm('location', v)} placeholder="Egypt" />
              <AdminInput label="YEAR" value={form.year} onChange={(v) => updateForm('year', v)} placeholder="2026" />
              <AdminInput label="WEIGHT" value={form.weight} onChange={(v) => updateForm('weight', v)} placeholder="27 TON" />
              <AdminInput label="SPAN" value={form.span} onChange={(v) => updateForm('span', v)} placeholder="24M" />
              <AdminInput label="STRUCTURE TYPE" value={form.structure_type} onChange={(v) => updateForm('structure_type', v)} placeholder="Steel Frame" />
            </div>
          </div>

          {/* Gallery */}
          {project && (
            <div className="bg-white border border-foreground/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-1.5 h-1.5 bg-safety" />
                <span className="tech-label-sm text-foreground/40">GALLERY</span>
              </div>

              {/* Add image by URL */}
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://image-url.jpg"
                  className="flex-1 bg-white border border-foreground/15 px-3 py-2 text-sm text-graphite focus:border-safety focus:outline-none transition-colors"
                />
                <AdminButton onClick={handleAddImage} disabled={!imageUrl.trim()}>
                  <Plus className="w-4 h-4" />
                  ADD
                </AdminButton>
              </div>

              {/* Image list */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group border border-foreground/10 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.alt} className="w-full aspect-square object-cover" />
                      {img.is_main && (
                        <div className="absolute top-1 left-1 bg-safety text-concrete text-[9px] px-2 py-0.5">MAIN</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-graphite/70 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2 py-2">
                        {!img.is_main && (
                          <button onClick={() => handleSetMain(img.id)} className="text-concrete hover:text-safety" title="Set as main">
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteImage(img.id)} className="text-concrete hover:text-red-400" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 py-4">No images yet. Add image URLs above.</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-foreground/10 p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block w-1.5 h-1.5 bg-safety" />
              <span className="tech-label-sm text-foreground/40">PUBLISH</span>
            </div>
            <AdminToggle label="Published" checked={form.published} onChange={(v) => updateForm('published', v)} />
            <AdminToggle label="Featured" checked={form.featured} onChange={(v) => updateForm('featured', v)} />
            <AdminInput label="SORT ORDER" type="number" value={String(form.sort_order)} onChange={(v) => updateForm('sort_order', parseInt(v) || 0)} />
          </div>

          <div className="bg-white border border-foreground/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-1.5 h-1.5 bg-safety" />
              <span className="tech-label-sm text-foreground/40">PREVIEW</span>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="tech-label-sm text-foreground/40 block mb-1">URL</span>
                <span className="text-foreground/60 font-mono text-xs">/projects/{form.slug || slugify(form.title) || '...'}</span>
              </div>
              <div>
                <span className="tech-label-sm text-foreground/40 block mb-1">STATUS</span>
                <span className={form.published ? 'text-safety' : 'text-foreground/40'}>
                  {form.published ? '● PUBLISHED' : '○ DRAFT'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
