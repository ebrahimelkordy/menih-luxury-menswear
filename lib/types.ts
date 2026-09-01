export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface CompanySettings {
  id: string;
  company_name: string;
  company_name_ar: string;
  description: string;
  about: string;
  mission: string;
  vision: string;
  founded_year: string;
  years_experience: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  hero_title: string;
  hero_title_second: string;
  hero_subtitle: string;
  hero_cta: string;
  final_cta_title: string;
  final_cta_description: string;
  final_cta_button: string;
  map_embed_url: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  year: string;
  status: string;
  description: string;
  weight: string;
  span: string;
  structure_type: string;
  execution_info: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  filename: string;
  alt: string;
  type: string;
  size: number;
  sort_order: number;
  is_main: boolean;
  created_at: string;
}

export interface ProjectWithImages extends Project {
  images: ProjectImage[];
  main_image?: ProjectImage | null;
}

export interface Capability {
  id: string;
  number: string;
  name: string;
  description: string;
  image_url: string;
  enabled: boolean;
  sort_order: number;
}

export interface ProcessStage {
  id: string;
  number: string;
  name: string;
  description: string;
  image_url: string;
  enabled: boolean;
  sort_order: number;
}

export interface SiteSection {
  id: string;
  section_key: string;
  section_label: string;
  visible: boolean;
  sort_order: number;
}
