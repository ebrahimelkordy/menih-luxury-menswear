import { useState, useMemo } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Check, X, Sparkles,
  Layers, Package, Eye, Image as ImageIcon, CheckCircle, Tag
} from 'lucide-react';
import { products as initialProducts, categories, formatPrice, heroImages, type Product, type Category, type ProductVariant } from '@/services/mockData';
import { saveProduct, deleteProduct } from '@/services/adminService';

export function AdminProductsTab() {
  const [productsList, setProductsList] = useState<Product[]>(() => [...initialProducts]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    titleAr: string;
    handle: string;
    category: Category;
    price: number;
    compareAtPrice?: number;
    fabric: string;
    fabricAr: string;
    sizes: string;
    description: string;
    descriptionAr: string;
    featured: boolean;
    opacityAr: string;
    variants: Array<Omit<ProductVariant, 'id'> & { id?: string }>;
  }>({
    title: '',
    titleAr: '',
    handle: '',
    category: 'thobe',
    price: 1500,
    compareAtPrice: 1800,
    fabric: '100% Egyptian Giza 94 Cotton',
    fabricAr: '??? ???? ???? ?? ???? ??????',
    sizes: '56M, 58L, 60L, 62XL',
    description: 'Exclusive bespoke luxury piece from Ezar.',
    descriptionAr: '???? ????? ????? ????? ?????? ?? ????.',
    featured: false,
    opacityAr: '??? ???? ????',
    variants: [
      { name: 'White', nameAr: '???? ????', colorHex: '#FFFFFF', colorFamily: 'neutral', image: heroImages.thobeGandoura, inStock: true },
    ],
  });

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.titleAr.includes(search) ||
        p.fabricAr.includes(search);
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [productsList, search, categoryFilter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      titleAr: '',
      handle: '',
      category: 'thobe',
      price: 1500,
      compareAtPrice: 1800,
      fabric: '100% Egyptian Giza 94 Cotton',
      fabricAr: '??? ???? ???? ?? ???? ??????',
      sizes: '56M, 58L, 60L, 62XL',
      description: 'Exclusive bespoke luxury piece from Ezar.',
      descriptionAr: '???? ????? ????? ????? ?????? ?? ????.',
      featured: false,
      opacityAr: '??? ???? ????',
      variants: [
        { name: 'White', nameAr: '???? ????', colorHex: '#FFFFFF', colorFamily: 'neutral', image: heroImages.thobeGandoura, inStock: true },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      title: product.title,
      titleAr: product.titleAr,
      handle: product.handle,
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      fabric: product.fabric,
      fabricAr: product.fabricAr,
      sizes: product.sizes.join(', '),
      description: product.description,
      descriptionAr: product.descriptionAr,
      featured: product.featured,
      opacityAr: product.opacityAr,
      variants: product.variants.map((v) => ({ ...v })),
    });
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: 'Imperial Black',
          nameAr: '???? ????',
          colorHex: '#1A1615',
          colorFamily: 'bold',
          image: heroImages.heroVeiledMan,
          inStock: true,
        },
      ],
    }));
  };

  const handleRemoveVariant = (idx: number) => {
    if (formData.variants.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);

    const saved = await saveProduct(
      {
        id: formData.id,
        title: formData.title,
        titleAr: formData.titleAr,
        handle: formData.handle || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        fabric: formData.fabric,
        fabricAr: formData.fabricAr,
        sizes: sizesArray.length > 0 ? sizesArray : ['Standard'],
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        featured: formData.featured,
        opacityAr: formData.opacityAr,
      },
      formData.variants,
      !!editingProduct
    );

    setProductsList((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });

    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id: string, titleAr: string) => {
    if (window.confirm(`?? ??? ????? ?? ??? ?????? "${titleAr}" ??????? ?? ???????`)) {
      await deleteProduct(id);
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-espresso-light/80 border border-terracotta/20 p-5 rounded-3xl shadow-lg">
        <div>
          <h2 className="font-serif text-xl font-bold text-ivory">?????? ???????? ????????</h2>
          <p className="text-xs text-ivory/50 mt-1">????? ??? ?????? ????? ???????? ???????? ????????? ??????? ???????.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-terracotta text-espresso font-bold text-xs rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          ????? ???? ???? ?????
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-espresso-light/50 border border-ivory/10 p-4 rounded-2xl">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="??? ?????? ?? ??? ??????..."
            className="w-full pl-4 pr-10 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-xs text-ivory placeholder:text-ivory/30 outline-none focus:border-terracotta transition-colors"
          />
          <Search className="w-4 h-4 text-ivory/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              categoryFilter === 'all' ? 'bg-terracotta text-espresso' : 'bg-espresso/80 text-ivory/60 hover:text-ivory'
            }`}
          >
            ???? ({productsList.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === c.id ? 'bg-terracotta text-espresso' : 'bg-espresso/80 text-ivory/60 hover:text-ivory'
              }`}
            >
              {c.nameAr} ({productsList.filter((p) => p.category === c.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const mainVariant = product.variants[0];
          return (
            <div
              key={product.id}
              className="bg-espresso-light/80 border border-terracotta/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-terracotta/50 transition-all"
            >
              <div className="relative aspect-[4/3] bg-espresso overflow-hidden">
                <img
                  src={mainVariant?.image || heroImages.thobeGandoura}
                  alt={product.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-espresso/80 backdrop-blur-sm text-ivory text-[10px] font-semibold rounded-full border border-ivory/10">
                  {product.categoryAr}
                </span>
                {product.featured && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-terracotta text-espresso text-[10px] font-bold rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> ????
                  </span>
                )}
                <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    {product.variants.map((v) => (
                      <div
                        key={v.id}
                        className="w-3.5 h-3.5 rounded-full border border-ivory/60 shadow-xs"
                        style={{ backgroundColor: v.colorHex }}
                        title={v.nameAr}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-ivory/70">{product.variants.length} ?????</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-sm font-bold text-ivory leading-snug">{product.titleAr}</h3>
                  <p className="text-[11px] text-ivory/40 mt-1 line-clamp-1">{product.fabricAr}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-ivory/5">
                  <div>
                    <span className="text-sm font-extrabold text-terracotta">{formatPrice(product.price)}</span>
                    {product.compareAtPrice && (
                      <span className="mr-1.5 text-[10px] text-ivory/30 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 bg-ivory/10 hover:bg-terracotta hover:text-espresso rounded-lg text-ivory transition-all cursor-pointer"
                      title="????? ??????"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.titleAr)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-ivory rounded-lg text-red-400 transition-all cursor-pointer"
                      title="??? ??????"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-espresso-light border border-terracotta/40 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-ivory/10">
              <h3 className="font-serif text-lg font-bold text-ivory flex items-center gap-2">
                <Package className="w-5 h-5 text-terracotta" />
                {editingProduct ? '????? ?????? ??????' : '????? ???? ???? ????'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-ivory/10 hover:bg-ivory/20 rounded-xl text-ivory transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Titles & Category */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">??? ?????? ???????? *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="????: ?????? ?????? ????? ???????"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">??? ?????? ??????????? (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Moroccan Gandoura"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">????? / ??????? *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">????? (?.?) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">????? ??? ????? (???????)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice || ''}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="?????? ???? ???????"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              {/* Fabric & Sizes */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">??? ?????? / ?????? (????)</label>
                  <input
                    type="text"
                    value={formData.fabricAr}
                    onChange={(e) => setFormData({ ...formData, fabricAr: e.target.value })}
                    placeholder="????: ??? ???? ???? ??"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">???????? ??????? (?????? ??????)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="????: 56, 58, 60, 62 ?? 1 Tola"
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">????? ???????? (????)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">????? ???????? (English)</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-2 p-3 bg-espresso/50 rounded-xl border border-ivory/5">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-terracotta cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-ivory font-semibold cursor-pointer">
                  ??? ????? ???? ?? ??? "??????? ?????" ??????? ????????
                </label>
              </div>

              {/* Variants Section */}
              <div className="pt-3 border-t border-ivory/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-ivory">????? ???????? ?????? (Variants)</h4>
                    <p className="text-[11px] text-ivory/40">??? ?????? ??????? ?????? ??????? ??? ???.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1.5 bg-ivory/10 hover:bg-terracotta hover:text-espresso rounded-xl text-ivory text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> ????? ??? ???
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.variants.map((variant, idx) => (
                    <div key={idx} className="p-3.5 bg-espresso/80 border border-ivory/10 rounded-2xl grid sm:grid-cols-5 gap-3 items-center">
                      <div>
                        <label className="block text-[10px] text-ivory/50 mb-1">??? ????? (????)</label>
                        <input
                          type="text"
                          value={variant.nameAr}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].nameAr = e.target.value;
                            setFormData({ ...formData, variants: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-espresso border border-ivory/10 rounded-lg text-ivory outline-none focus:border-terracotta"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-ivory/50 mb-1">??? ????? (Hex)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.colorHex}
                            onChange={(e) => {
                              const updated = [...formData.variants];
                              updated[idx].colorHex = e.target.value;
                              setFormData({ ...formData, variants: updated });
                            }}
                            className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={variant.colorHex}
                            onChange={(e) => {
                              const updated = [...formData.variants];
                              updated[idx].colorHex = e.target.value;
                              setFormData({ ...formData, variants: updated });
                            }}
                            className="w-full px-2 py-1.5 bg-espresso border border-ivory/10 rounded-lg text-ivory font-mono text-[11px]"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-ivory/50 mb-1">???? ?? ???? ??????</label>
                        <input
                          type="text"
                          value={variant.image}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].image = e.target.value;
                            setFormData({ ...formData, variants: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-espresso border border-ivory/10 rounded-lg text-ivory font-mono text-[11px]"
                          dir="ltr"
                        />
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
                        <label className="flex items-center gap-1.5 text-ivory/70 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variant.inStock}
                            onChange={(e) => {
                              const updated = [...formData.variants];
                              updated[idx].inStock = e.target.checked;
                              setFormData({ ...formData, variants: updated });
                            }}
                            className="accent-terracotta"
                          />
                          <span>?????</span>
                        </label>
                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                            title="????? ??? ?????"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-ivory/10 hover:bg-ivory/20 text-ivory rounded-xl font-semibold transition-all cursor-pointer"
                >
                  ?????
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-terracotta text-espresso font-bold rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  ??? ?????? ?? ????????
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

