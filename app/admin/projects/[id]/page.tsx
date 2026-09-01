'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { LoadingState } from '@/components/admin/AdminUI';
import type { Project } from '@/lib/types';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .maybeSingle();
      setProject(data);
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) return <LoadingState label="LOADING PROJECT" />;

  if (!project) {
    return <div className="text-center py-20 text-foreground/40">Project not found.</div>;
  }

  return <ProjectForm project={project} />;
}
