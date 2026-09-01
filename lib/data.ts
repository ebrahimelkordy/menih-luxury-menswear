import { supabase } from './supabase-client';
import type {
  CompanySettings,
  Project,
  ProjectImage,
  ProjectWithImages,
  Capability,
  ProcessStage,
  SiteSection,
} from './types';

// Default placeholder data used when the database is empty
export const DEFAULT_SETTINGS: CompanySettings = {
  id: '',
  company_name: 'Al-Kordy Contracting',
  company_name_ar: 'الكردي للمقاولات',
  description: 'Metal construction and steel fabrication.',
  about: 'Al-Kordy Contracting is a metal construction and steel fabrication company operating in Egypt, delivering structural steel systems for industrial and commercial projects.',
  mission: 'To deliver metal structures built with precision, discipline and experience.',
  vision: '',
  founded_year: '',
  years_experience: '',
  address: 'Egypt',
  phone: '',
  whatsapp: '',
  email: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  hero_title: 'FROM MATERIAL',
  hero_title_second: 'TO STRUCTURE.',
  hero_subtitle: 'Metal construction and steel fabrication built with precision, discipline and experience.',
  hero_cta: 'REQUEST A QUOTE',
  final_cta_title: "LET'S BUILD WHAT LASTS.",
  final_cta_description: 'Contact Al-Kordy Contracting for your next metal construction or steel structure project.',
  final_cta_button: 'REQUEST A QUOTE',
  map_embed_url: '',
};

export async function getCompanySettings(): Promise<CompanySettings> {
  const { data } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  return data ?? DEFAULT_SETTINGS;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (!project) return null;

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  const imageList = images ?? [];
  const mainImage = imageList.find((img) => img.is_main) ?? imageList[0] ?? null;

  return { ...project, images: imageList, main_image: mainImage };
}

export async function getRelatedProjects(currentId: string, category: string, limit = 3): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .neq('id', currentId)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getEnabledCapabilities(): Promise<Capability[]> {
  const { data } = await supabase
    .from('capabilities')
    .select('*')
    .eq('enabled', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getEnabledProcessStages(): Promise<ProcessStage[]> {
  const { data } = await supabase
    .from('process_stages')
    .select('*')
    .eq('enabled', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getVisibleSections(): Promise<SiteSection[]> {
  const { data } = await supabase
    .from('site_sections')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  const { data } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  return data ?? [];
}
