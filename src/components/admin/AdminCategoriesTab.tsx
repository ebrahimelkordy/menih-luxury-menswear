import { useState, useEffect } from 'react';
import {
  Layers, Edit, Check, X, Plus, Trash2, Image as ImageIcon, Package, Upload
} from 'lucide-react';
import { categories as initialCategories, products, type CategoryInfo, type Category } from '@/services/mockData';
import { processUploadedImageFile } from '@/utils/imageUpload';
import { createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/services/apiClient';

export function AdminCategoriesTab() {
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>(() => [...initialCategories]);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const isModalOpen = Boolean(editingCategory || isCreating);



  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    image: string;
  }>({
    id: '',
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: '',
  });

  const openAdd = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setFormData({
      id: '',
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      image: '',
    });
  };

  const openEdit = (cat: CategoryInfo) => {
    setIsCreating(false);
    setEditingCategory(cat);
    setFormData({
      id: cat.id,
      name: cat.name,
      nameAr: cat.nameAr,
      description: cat.description,
      descriptionAr: cat.descriptionAr,
      image: cat.image,
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await processUploadedImageFile(file);
        setFormData((prev) => ({ ...prev, image: dataUrl }));
      } catch (err) {
        console.error('Failed to upload image:', err);
        alert('تعذر تحميل ملف الصورة، يرجى تجربة ملف آخر.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreating) {
      const slug = (formData.id || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) as Category;
      const newCat: CategoryInfo = {
        id: slug,
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        image: formData.image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
      };

      try {
        await createCategoryApi({
          name: newCat.name,
          nameAr: newCat.nameAr,
          slug: newCat.id,
          description: newCat.description,
          descriptionAr: newCat.descriptionAr,
          image: newCat.image,
        });
      } catch (err) {
        console.warn('Backend category creation fallback to local state:', err);
      }

      setCategoriesList((prev) => [...prev, newCat]);
      initialCategories.push(newCat);
      setIsCreating(false);
    } else if (editingCategory) {
      const updatedCat: CategoryInfo = {
        ...editingCategory,
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        image: formData.image,
      };

      try {
        await updateCategoryApi(editingCategory.id, {
          name: updatedCat.name,
          nameAr: updatedCat.nameAr,
          description: updatedCat.description,
          descriptionAr: updatedCat.descriptionAr,
          image: updatedCat.image,
        });
      } catch (err) {
        console.warn('Backend category update fallback to local state:', err);
      }

      setCategoriesList((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? updatedCat : c))
      );

      const catIdx = initialCategories.findIndex((c) => c.id === editingCategory.id);
      if (catIdx >= 0) {
        initialCategories[catIdx] = updatedCat;
      }

      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id: string, nameAr: string) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${nameAr}"؟`)) {
      try {
        await deleteCategoryApi(id);
      } catch (err) {
        console.warn('Backend category delete fallback to local state:', err);
      }

      setCategoriesList((prev) => prev.filter((c) => c.id !== id));
      const idx = initialCategories.findIndex((c) => c.id === id);
      if (idx >= 0) {
        initialCategories.splice(idx, 1);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-espresso-light/80 border border-terracotta/20 p-5 rounded-3xl shadow-lg">
        <div>
          <h2 className="font-serif text-xl font-bold text-ivory">أقسام وتصنيفات المتجر (Categories)</h2>
          <p className="text-xs text-ivory/50 mt-1">إدارة الأقسام الرئيسية، الصور الترويجية، ونصوص الشرح في المتجر.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-terracotta text-espresso font-bold text-xs rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          إضافة قسم جديد
        </button>
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(category)}
                      className="px-3 py-1.5 bg-ivory/10 hover:bg-terracotta hover:text-espresso text-ivory text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id, category.nameAr)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-ivory rounded-xl text-red-400 transition-all cursor-pointer"
                      title="حذف القسم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Category Modal */}
      {(editingCategory || isCreating) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/85 backdrop-blur-md p-3 sm:p-6 md:p-8 flex items-start justify-center animate-fade-in">
          <div className="relative w-full max-w-xl bg-espresso-light border border-terracotta/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-scale-up">
            {/* Header */}
            <div className="bg-espresso border-b border-ivory/10 px-5 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-base sm:text-lg font-bold text-ivory flex items-center gap-2">
                <Layers className="w-5 h-5 text-terracotta flex-shrink-0" />
                <span>{isCreating ? 'إضافة قسم جديد للمتجر' : `تعديل قسم: ${editingCategory?.nameAr}`}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setIsCreating(false);
                }}
                className="p-2 bg-ivory/10 hover:bg-ivory/20 rounded-xl text-ivory transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">اسم القسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: ثياب ملكية"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">اسم القسم بالإنجليزية (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Thobes"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {isCreating && (
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">معرّف القسم (Slug - اختياري)</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="مثال: thobe"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory font-mono outline-none focus:border-terracotta"
                    dir="ltr"
                  />
                </div>
              )}

              {/* Image Upload Input */}
              <div className="space-y-2">
                <label className="block text-ivory/70 font-semibold">صورة غلاف القسم *</label>
                
                {formData.image && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-terracotta/30 bg-espresso mb-2">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-espresso/80 rounded-lg text-ivory hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2.5 bg-terracotta/20 hover:bg-terracotta/30 border border-terracotta/40 text-ivory font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-terracotta" />
                    <span>رفع صورة من جهازك</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-ivory/40">أو ادخل رابط الصورة مباشرة:</span>
                </div>

                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory font-mono outline-none focus:border-terracotta text-xs"
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

              {/* Action Footer */}
              <div className="pt-5 border-t border-ivory/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 bg-ivory/10 hover:bg-ivory/20 text-ivory rounded-xl font-semibold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-terracotta text-espresso font-bold rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {isCreating ? 'إضافة القسم' : 'حفظ تعديلات القسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
