import { useState } from 'react';
import {
  Layers, Edit, Check, X, Sparkles, Image as ImageIcon, Package
} from 'lucide-react';
import { categories as initialCategories, products, type CategoryInfo } from '@/services/mockData';
import { updateCategoryApi } from '@/services/apiClient';

export function AdminCategoriesTab() {
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>(() => [...initialCategories]);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    image: string;
  }>({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: '',
  });

  const openEdit = (cat: CategoryInfo) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      nameAr: cat.nameAr,
      description: cat.description,
      descriptionAr: cat.descriptionAr,
      image: cat.image,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategoryApi(editingCategory.id, {
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        image: formData.image,
      });
    } catch (err) {
      console.warn('Saved category locally:', err);
    }

    setCategoriesList((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name,
              nameAr: formData.nameAr,
              description: formData.description,
              descriptionAr: formData.descriptionAr,
              image: formData.image,
            }
          : c
      )
    );

    // Save in memory
    const catIdx = initialCategories.findIndex((c) => c.id === editingCategory.id);
    if (catIdx >= 0) {
      initialCategories[catIdx].name = formData.name;
      initialCategories[catIdx].nameAr = formData.nameAr;
      initialCategories[catIdx].description = formData.description;
      initialCategories[catIdx].descriptionAr = formData.descriptionAr;
      initialCategories[catIdx].image = formData.image;
    }

    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="bg-espresso-light/80 border border-terracotta/20 p-5 rounded-3xl shadow-lg">
        <h2 className="font-serif text-xl font-bold text-ivory">أقسام وتصنيفات المتجر (Categories)</h2>
        <p className="text-xs text-ivory/50 mt-1">إدارة الأقسام الرئيسية، الصور الترويجية، ونصوص الشرح في المتجر.</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoriesList.map((category) => {
          const count = products.filter((p) => p.category === category.id).length;
          return (
            <div
              key={category.id}
              className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-terracotta/50 transition-all"
            >
              <div className="relative aspect-[16/9] bg-espresso overflow-hidden">
                <img
                  src={category.image}
                  alt={category.nameAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 bg-espresso/80 backdrop-blur-md text-ivory text-xs font-semibold rounded-full border border-ivory/10 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-terracotta" />
                  {count} قطع متوفرة
                </span>
                <div className="absolute bottom-3 right-3 left-3 text-ivory">
                  <h3 className="font-serif text-lg font-bold">{category.nameAr}</h3>
                  <div className="text-xs text-ivory/60 font-mono" dir="ltr">{category.name}</div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-ivory/70 line-clamp-2 leading-relaxed">
                  {category.descriptionAr}
                </p>

                <div className="pt-3 border-t border-ivory/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-md">
                    slug: #{category.id}
                  </span>
                  <button
                    onClick={() => openEdit(category)}
                    className="px-4 py-2 bg-ivory/10 hover:bg-terracotta hover:text-espresso text-ivory text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    تعديل القسم
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-espresso-light border border-terracotta/40 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-ivory/10">
              <h3 className="font-serif text-lg font-bold text-ivory flex items-center gap-2">
                <Layers className="w-5 h-5 text-terracotta" />
                تعديل قسم: {editingCategory.nameAr}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-2 bg-ivory/10 hover:bg-ivory/20 rounded-xl text-ivory transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">اسم القسم بالعربية</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">اسم القسم بالإنجليزية (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ivory/70 font-semibold mb-1">مسار صورة الغلاف للقسم</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory font-mono outline-none focus:border-terracotta"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-ivory/70 font-semibold mb-1">الوصف بالعربية</label>
                <textarea
                  rows={3}
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none"
                />
              </div>

              <div>
                <label className="block text-ivory/70 font-semibold mb-1">الوصف بالإنجليزية (English)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory/10">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 bg-ivory/10 hover:bg-ivory/20 text-ivory rounded-xl font-semibold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-terracotta text-espresso font-bold rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  حفظ تعديلات القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
