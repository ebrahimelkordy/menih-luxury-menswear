'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { AdminButton, AdminInput, AdminTextarea, LoadingState } from '@/components/admin/AdminUI';
import { Save, Loader2 } from 'lucide-react';
import type { CompanySettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('company_settings').select('*').limit(1).maybeSingle();
      setSettings(data);
    })();
  }, []);

  const update = (key: string, value: string) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    const { error: updateError } = await supabase
      .from('company_settings')
      .update({
        company_name: settings.company_name,
        company_name_ar: settings.company_name_ar,
        description: settings.description,
        about: settings.about,
        mission: settings.mission,
        vision: settings.vision,
        founded_year: settings.founded_year,
        years_experience: settings.years_experience,
        address: settings.address,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        facebook: settings.facebook,
        instagram: settings.instagram,
        linkedin: settings.linkedin,
        hero_title: settings.hero_title,
        hero_title_second: settings.hero_title_second,
        hero_subtitle: settings.hero_subtitle,
        hero_cta: settings.hero_cta,
        final_cta_title: settings.final_cta_title,
        final_cta_description: settings.final_cta_description,
        final_cta_button: settings.final_cta_button,
        map_embed_url: settings.map_embed_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return <LoadingState label="LOADING SETTINGS" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">CMS</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tightest text-graphite">SETTINGS</h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="tech-label-sm text-safety">SAVED ✓</span>}
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            SAVE
          </AdminButton>
        </div>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="border-l-2 border-red-500 px-4 py-3 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {/* Company info */}
        <div className="bg-white border border-foreground/10 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">COMPANY</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="COMPANY NAME" value={settings.company_name} onChange={(v) => update('company_name', v)} />
            <AdminInput label="COMPANY NAME (ARABIC)" value={settings.company_name_ar} onChange={(v) => update('company_name_ar', v)} />
          </div>
          <AdminTextarea label="DESCRIPTION" value={settings.description} onChange={(v) => update('description', v)} rows={2} />
          <AdminTextarea label="ABOUT" value={settings.about} onChange={(v) => update('about', v)} rows={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminTextarea label="MISSION" value={settings.mission} onChange={(v) => update('mission', v)} rows={2} />
            <AdminTextarea label="VISION" value={settings.vision} onChange={(v) => update('vision', v)} rows={2} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="FOUNDED YEAR" value={settings.founded_year} onChange={(v) => update('founded_year', v)} />
            <AdminInput label="YEARS OF EXPERIENCE" value={settings.years_experience} onChange={(v) => update('years_experience', v)} />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-foreground/10 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">CONTACT</span>
          </div>
          <AdminInput label="ADDRESS" value={settings.address} onChange={(v) => update('address', v)} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminInput label="PHONE" value={settings.phone} onChange={(v) => update('phone', v)} />
            <AdminInput label="WHATSAPP" value={settings.whatsapp} onChange={(v) => update('whatsapp', v)} />
            <AdminInput label="EMAIL" value={settings.email} onChange={(v) => update('email', v)} />
          </div>
          <AdminInput label="GOOGLE MAPS EMBED URL" value={settings.map_embed_url} onChange={(v) => update('map_embed_url', v)} placeholder="https://www.google.com/maps/embed?pb=..." />
          <p className="text-xs text-foreground/40 -mt-2">
            Go to Google Maps → Share → Embed a map → Copy the src URL and paste it here.
          </p>
        </div>

        {/* Social */}
        <div className="bg-white border border-foreground/10 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">SOCIAL</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminInput label="FACEBOOK" value={settings.facebook} onChange={(v) => update('facebook', v)} />
            <AdminInput label="INSTAGRAM" value={settings.instagram} onChange={(v) => update('instagram', v)} />
            <AdminInput label="LINKEDIN" value={settings.linkedin} onChange={(v) => update('linkedin', v)} />
          </div>
        </div>

        {/* Homepage content */}
        <div className="bg-white border border-foreground/10 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">HOMEPAGE — HERO</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="HERO TITLE (LINE 1)" value={settings.hero_title} onChange={(v) => update('hero_title', v)} />
            <AdminInput label="HERO TITLE (LINE 2)" value={settings.hero_title_second} onChange={(v) => update('hero_title_second', v)} />
          </div>
          <AdminTextarea label="HERO SUBTITLE" value={settings.hero_subtitle} onChange={(v) => update('hero_subtitle', v)} rows={2} />
          <AdminInput label="HERO CTA" value={settings.hero_cta} onChange={(v) => update('hero_cta', v)} />
        </div>

        {/* Final CTA */}
        <div className="bg-white border border-foreground/10 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">HOMEPAGE — FINAL CTA</span>
          </div>
          <AdminInput label="FINAL CTA TITLE" value={settings.final_cta_title} onChange={(v) => update('final_cta_title', v)} />
          <AdminTextarea label="FINAL CTA DESCRIPTION" value={settings.final_cta_description} onChange={(v) => update('final_cta_description', v)} rows={2} />
          <AdminInput label="FINAL CTA BUTTON" value={settings.final_cta_button} onChange={(v) => update('final_cta_button', v)} />
        </div>

        {/* Save bar at bottom */}
        <div className="sticky bottom-0 bg-concrete-50 border-t border-foreground/10 p-4 -mx-5 md:-mx-8 lg:-mx-10 flex items-center justify-end gap-3">
          {saved && <span className="tech-label-sm text-safety">SAVED ✓</span>}
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            SAVE ALL CHANGES
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
