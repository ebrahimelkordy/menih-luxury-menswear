'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { AdminButton, AdminInput, AdminTextarea, AdminToggle, EmptyState, LoadingState } from '@/components/admin/AdminUI';
import { Plus, Trash2, Save, X, GripVertical } from 'lucide-react';
import type { Capability } from '@/lib/types';

export default function AdminCapabilitiesPage() {
  const [items, setItems] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Capability | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('capabilities').select('*').order('sort_order', { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this capability?')) return;
    await supabase.from('capabilities').delete().eq('id', id);
    load();
  };

  const toggleEnabled = async (item: Capability) => {
    await supabase.from('capabilities').update({ enabled: !item.enabled }).eq('id', item.id);
    load();
  };

  if (loading) return <LoadingState label="LOADING CAPABILITIES" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-1.5 h-1.5 bg-safety" />
            <span className="tech-label-sm text-foreground/40">CMS</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tightest text-graphite">CAPABILITIES</h1>
        </div>
        <AdminButton onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> NEW
        </AdminButton>
      </div>

      {showForm && (
        <CapabilityForm
          item={editing}
          onClose={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}

      {items.length === 0 && !showForm ? (
        <EmptyState title="No capabilities yet" description="Add your company's services and capabilities." action={<AdminButton onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="w-4 h-4" /> ADD CAPABILITY</AdminButton>} />
      ) : (
        <div className="bg-white border border-foreground/10">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-foreground/5 last:border-b-0 hover:bg-concrete-50/50 transition-colors">
              <GripVertical className="w-4 h-4 text-foreground/20 flex-shrink-0" />
              <span className="tech-label-sm text-safety font-mono w-8 flex-shrink-0">{item.number}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-graphite">{item.name}</div>
                <div className="text-xs text-foreground/40 truncate">{item.description}</div>
              </div>
              <button onClick={() => toggleEnabled(item)} className={`text-xs ${item.enabled ? 'text-safety' : 'text-foreground/30'}`}>
                {item.enabled ? '● ENABLED' : '○ DISABLED'}
              </button>
              <AdminButton variant="ghost" onClick={() => { setEditing(item); setShowForm(true); }}>EDIT</AdminButton>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4 text-foreground/40" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CapabilityForm({ item, onClose }: { item: Capability | null; onClose: () => void }) {
  const [form, setForm] = useState({
    number: item?.number ?? String(Date.now() % 100).padStart(2, '0'),
    name: item?.name ?? '',
    description: item?.description ?? '',
    image_url: item?.image_url ?? '',
    enabled: item?.enabled ?? true,
    sort_order: item?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    if (item) {
      await supabase.from('capabilities').update({ ...form, updated_at: new Date().toISOString() }).eq('id', item.id);
    } else {
      await supabase.from('capabilities').insert(form);
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="bg-white border border-foreground/10 p-6 mb-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 bg-safety" />
          <span className="tech-label-sm text-foreground/40">{item ? 'EDIT' : 'NEW'} CAPABILITY</span>
        </div>
        <button onClick={onClose} className="p-1 hover:text-safety transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="NUMBER" value={form.number} onChange={(v) => setForm({ ...form, number: v })} />
        <AdminInput label="SORT ORDER" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} />
      </div>
      <AdminInput label="NAME" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
      <AdminTextarea label="DESCRIPTION" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
      <AdminInput label="IMAGE URL (OPTIONAL)" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
      <AdminToggle label="Enabled" checked={form.enabled} onChange={(v) => setForm({ ...form, enabled: v })} />
      <div className="flex gap-3">
        <AdminButton onClick={handleSave} disabled={saving || !form.name.trim()}>
          {saving ? 'SAVING...' : <><Save className="w-4 h-4" /> SAVE</>}
        </AdminButton>
        <AdminButton variant="outline" onClick={onClose}>CANCEL</AdminButton>
      </div>
    </div>
  );
}
