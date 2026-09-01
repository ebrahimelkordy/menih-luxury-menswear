import { useState, useEffect } from 'react';
import {
  TrendingUp, ShoppingBag, DollarSign, Package, ArrowUpRight,
  Clock, CheckCircle, Truck, Eye, Plus, Sparkles, AlertCircle
} from 'lucide-react';
import { getAdminOrders, type AdminOrder } from '@/services/adminService';
import { products, heroImages, formatPrice } from '@/services/mockData';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: string) => void;
}

export function AdminOverviewTab({ onNavigateTab }: AdminOverviewTabProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeProductsCount = products.length;

  const recentOrders = orders.slice(0, 5);

  const statusBadges: Record<string, { label: string; bg: string; text: string }> = {
    pending: { label: 'قيد الانتظار', bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400' },
    processing: { label: 'جاري التجهيز', bg: 'bg-blue-500/15 border-blue-500/30', text: 'text-blue-400' },
    shipped: { label: 'تم الشحن', bg: 'bg-purple-500/15 border-purple-500/30', text: 'text-purple-400' },
    delivered: { label: 'تم التسليم', bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400' },
    cancelled: { label: 'ملغي', bg: 'bg-red-500/15 border-red-500/30', text: 'text-red-400' },
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-espresso-light via-espresso to-espresso-light p-6 rounded-3xl border border-terracotta/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-terracotta text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            نظرة عامة على إزار
          </div>
          <h2 className="font-serif text-2xl font-bold text-ivory">مرحباً بك في لوحة الإدارة</h2>
          <p className="text-xs text-ivory/60 mt-1">إليك ملخص مبيعات المتجر، حالة الطلبات، والمنتجات النشطة اليوم.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 bg-terracotta text-espresso font-bold text-xs rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج جديد
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2.5 bg-espresso/80 border border-terracotta/30 text-ivory text-xs font-semibold rounded-xl hover:bg-espresso transition-all cursor-pointer"
          >
            عرض كافة الطلبات
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-ivory/60">إجمالي المبيعات</span>
            <div className="w-9 h-9 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-ivory">{formatPrice(totalRevenue)}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% نمو المبيعات هذا الشهر</span>
          </div>
        </div>

        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-ivory/60">إجمالي الطلبات</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-ivory">{totalOrders} طلب</div>
          <div className="flex items-center gap-1 text-[11px] text-ivory/50 mt-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{orders.filter(o => o.status === 'pending').length} طلبات قيد المراجعة</span>
          </div>
        </div>

        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-ivory/60">متوسط قيمة الطلب</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-ivory">{formatPrice(avgOrderValue)}</div>
          <div className="flex items-center gap-1 text-[11px] text-ivory/50 mt-2">
            <span>يشمل خصم الأطقم المنسقة ١٥٪</span>
          </div>
        </div>

        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-ivory/60">المنتجات النشطة</span>
            <div className="w-9 h-9 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-ivory">{activeProductsCount} منتج</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>كافة الأقسام الخمسة متوفرة</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Top Selling */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-ivory/10">
            <div>
              <h3 className="font-serif text-lg font-bold text-ivory">أحدث الطلبات الواردة</h3>
              <p className="text-xs text-ivory/50">الطلبات المسجلة من العملاء عبر الموقع</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-terracotta font-semibold hover:underline flex items-center gap-1"
            >
              عرض الكل ({orders.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-ivory/40 text-sm">جاري تحميل الطلبات...</div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center text-ivory/40 text-sm">لا توجد طلبات مسجلة بعد.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-ivory/40 border-b border-ivory/5 pb-2">
                    <th className="pb-3 font-medium">رقم الطلب</th>
                    <th className="pb-3 font-medium">العميل</th>
                    <th className="pb-3 font-medium">المدينة</th>
                    <th className="pb-3 font-medium">الإجمالي</th>
                    <th className="pb-3 font-medium">الحالة</th>
                    <th className="pb-3 font-medium">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory/5 text-ivory/80">
                  {recentOrders.map((ord) => {
                    const badge = statusBadges[ord.status] || statusBadges.pending;
                    return (
                      <tr key={ord.id} className="hover:bg-ivory/5 transition-colors">
                        <td className="py-3.5 font-mono text-terracotta font-semibold">{ord.orderNumber}</td>
                        <td className="py-3.5 font-medium text-ivory">{ord.customerName}</td>
                        <td className="py-3.5 text-ivory/60">{ord.customerCity}</td>
                        <td className="py-3.5 font-bold text-ivory">{formatPrice(ord.total)}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <button
                            onClick={() => onNavigateTab('orders')}
                            className="p-1.5 bg-ivory/10 hover:bg-terracotta hover:text-espresso rounded-lg transition-all text-ivory/70"
                            title="عرض تفاصيل الطلب"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Top Selling Products (1 col) */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory/10">
            <div>
              <h3 className="font-serif text-lg font-bold text-ivory">الأكثر طلباً</h3>
              <p className="text-xs text-ivory/50">القطع الأعلى مبيعاً في الدار</p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-terracotta font-semibold hover:underline"
            >
              المنتجات
            </button>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-espresso/60 border border-ivory/5 hover:border-terracotta/30 transition-all">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream flex-shrink-0 relative">
                  <img src={p.variants?.[0]?.image || heroImages.thobeGandoura} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-terracotta text-espresso rounded-full text-[9px] font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-ivory truncate">{p.titleAr}</div>
                  <div className="text-[10px] text-ivory/40">{p.categoryAr}</div>
                  <div className="text-xs font-bold text-terracotta mt-0.5">{formatPrice(p.price)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-ivory/10">
            <button
              onClick={() => onNavigateTab('cms')}
              className="w-full py-2.5 bg-ivory/5 hover:bg-ivory/10 border border-ivory/10 text-ivory text-xs font-semibold rounded-xl transition-all text-center block"
            >
              تعديل صور وبنرات الصفحة الرئيسية ←
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

