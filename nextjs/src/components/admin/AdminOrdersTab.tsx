import { useState, useEffect, useMemo } from 'react';
import {
  Search, Eye, Trash2, Printer, Download,
  Package, X, Phone, MapPin, Calendar, CreditCard, MessageCircle, ExternalLink
} from 'lucide-react';
import { getAdminOrders, updateOrderStatus, deleteOrder, type AdminOrder } from '@/services/adminService';
import { formatPrice } from '@/services/mockData';

export function AdminOrdersTab() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAdminOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search) ||
        (o.customerWhatsapp && o.customerWhatsapp.includes(search)) ||
        o.customerCity.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: AdminOrder['status']) => {
    setSavingStatus(true);
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setSavingStatus(false);
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟')) {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    }
  };

  const exportCSV = () => {
    const headers = ['رقم الطلب', 'اسم العميل', 'رقم الهاتف', 'رقم الواتساب', 'المدينة', 'العنوان', 'الإجمالي', 'الحالة', 'تاريخ الطلب'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerWhatsapp || o.customerPhone}"`,
      `"${o.customerCity}"`,
      `"${o.customerAddress}"`,
      o.total,
      o.status,
      `"${new Date(o.createdAt).toLocaleDateString('ar-EG')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ezar_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printOrder = () => {
    window.print();
  };

  const getWhatsAppLink = (order: AdminOrder) => {
    const targetNum = (order.customerWhatsapp || order.customerPhone).replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `مرحباً بك ${order.customerName}، نتواصل معك من إزار للأزياء الرجالية بخصوص طلبك رقم (${order.orderNumber}). نسعد بتأكيد المقاسات وموعد تسليم الطلب.`
    );
    return `https://wa.me/${targetNum}?text=${msg}`;
  };

  const statusOptions = [
    { value: 'all', label: 'كافة الطلبات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'processing', label: 'جاري التجهيز' },
    { value: 'shipped', label: 'تم الشحن' },
    { value: 'delivered', label: 'تم التسليم' },
    { value: 'cancelled', label: 'ملغي' },
  ];

  const statusBadges: Record<string, { label: string; bg: string; text: string }> = {
    pending: { label: 'قيد الانتظار', bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400' },
    processing: { label: 'جاري التجهيز', bg: 'bg-blue-500/15 border-blue-500/30', text: 'text-blue-400' },
    shipped: { label: 'تم الشحن', bg: 'bg-purple-500/15 border-purple-500/30', text: 'text-purple-400' },
    delivered: { label: 'تم التسليم', bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400' },
    cancelled: { label: 'ملغي', bg: 'bg-red-500/15 border-red-500/30', text: 'text-red-400' },
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-espresso-light/80 border border-terracotta/20 p-5 rounded-3xl shadow-lg">
        <div>
          <h2 className="font-serif text-xl font-bold text-ivory">سجل وإدارة طلبات العملاء والواتساب</h2>
          <p className="text-xs text-ivory/50 mt-1">عرض وتحديث حالات الطلبات، أرقام الواتساب الإجبارية، مراسلة العملاء الفورية، وطباعة الفواتير.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-espresso border border-terracotta/30 text-ivory text-xs font-semibold rounded-xl hover:bg-terracotta hover:text-espresso transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            تصدير CSV
          </button>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-terracotta text-espresso text-xs font-bold rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            تحديث القائمة
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-espresso-light/50 border border-ivory/10 p-4 rounded-2xl">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب، العميل، الهاتف، أو الواتساب..."
            className="w-full pl-4 pr-10 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-xs text-ivory placeholder:text-ivory/30 outline-none focus:border-terracotta transition-colors"
          />
          <Search className="w-4 h-4 text-ivory/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === opt.value
                  ? 'bg-terracotta text-espresso shadow-md'
                  : 'bg-espresso/80 text-ivory/60 hover:text-ivory hover:bg-espresso'
              }`}
            >
              {opt.label}
              {opt.value !== 'all' && (
                <span className="mr-1.5 text-[10px] opacity-75">
                  ({orders.filter((o) => o.status === opt.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-ivory/40 text-sm">جاري تحميل سجل الطلبات...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-ivory/40 text-sm">لا توجد طلبات مطابقة للبحث.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-espresso/80 text-ivory/50 border-b border-ivory/10">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">رقم الطلب</th>
                  <th className="py-3.5 px-4 font-semibold">التاريخ</th>
                  <th className="py-3.5 px-4 font-semibold">العميل</th>
                  <th className="py-3.5 px-4 font-semibold">الهاتف الأساسي</th>
                  <th className="py-3.5 px-4 font-semibold">رقم الواتساب</th>
                  <th className="py-3.5 px-4 font-semibold">المدينة</th>
                  <th className="py-3.5 px-4 font-semibold">الإجمالي</th>
                  <th className="py-3.5 px-4 font-semibold">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory/5 text-ivory/80">
                {filteredOrders.map((ord) => {
                  const badge = statusBadges[ord.status] || statusBadges.pending;
                  return (
                    <tr key={ord.id} className="hover:bg-ivory/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-terracotta">{ord.orderNumber}</td>
                      <td className="py-3.5 px-4 text-ivory/50">
                        {new Date(ord.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-ivory">{ord.customerName}</td>
                      <td className="py-3.5 px-4 font-mono text-ivory/70" dir="ltr">{ord.customerPhone}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400" dir="ltr">
                        {ord.customerWhatsapp || ord.customerPhone}
                      </td>
                      <td className="py-3.5 px-4 text-ivory/60">{ord.customerCity}</td>
                      <td className="py-3.5 px-4 font-bold text-ivory">{formatPrice(ord.total)}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as AdminOrder['status'])}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border outline-none cursor-pointer bg-espresso ${badge.text} ${badge.bg}`}
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="processing">جاري التجهيز</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="delivered">تم التسليم</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* WhatsApp Chat Quick Action */}
                          <a
                            href={getWhatsAppLink(ord)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                            title="مراسلة العميل مباشرة عبر واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-2 bg-ivory/10 hover:bg-terracotta hover:text-espresso rounded-xl transition-all text-ivory cursor-pointer"
                            title="عرض تفاصيل الطلب"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ord.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-ivory rounded-xl transition-all text-red-400 cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-espresso-light border border-terracotta/40 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-ivory/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-terracotta">{selectedOrder.orderNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadges[selectedOrder.status]?.bg} ${statusBadges[selectedOrder.status]?.text}`}>
                    {statusBadges[selectedOrder.status]?.label}
                  </span>
                </div>
                <div className="text-xs text-ivory/50 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedOrder.createdAt).toLocaleString('ar-EG')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>مراسلة واتساب</span>
                </a>
                <button
                  onClick={printOrder}
                  className="p-2 bg-ivory/10 hover:bg-ivory/20 rounded-xl text-ivory transition-colors cursor-pointer"
                  title="طباعة إيصال الطلب"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-ivory/10 hover:bg-ivory/20 rounded-xl text-ivory transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid sm:grid-cols-2 gap-4 bg-espresso/80 p-4 rounded-2xl border border-ivory/5 text-xs">
              <div>
                <div className="text-ivory/40 mb-1 font-medium">بيانات العميل والاتصال</div>
                <div className="text-sm font-bold text-ivory">{selectedOrder.customerName}</div>
                <div className="text-terracotta mt-1.5 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>الهاتف: {selectedOrder.customerPhone}</span>
                </div>
                <div className="text-emerald-400 mt-1 font-mono flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>الواتساب: {selectedOrder.customerWhatsapp || selectedOrder.customerPhone}</span>
                </div>
              </div>
              <div>
                <div className="text-ivory/40 mb-1 font-medium">عنوان التوصيل وطريقة الدفع</div>
                <div className="text-ivory font-medium flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-terracotta mt-0.5 flex-shrink-0" />
                  <span>{selectedOrder.customerCity} — {selectedOrder.customerAddress}</span>
                </div>
                <div className="text-ivory/50 mt-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  الدفع: {selectedOrder.paymentMethod === 'card' ? 'بطاقة بنكية' : 'دفع عند الاستلام (COD)'}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-serif text-sm font-bold text-ivory mb-3">المنتجات المطلوبة</h4>
              <div className="space-y-2.5">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-espresso/50 border border-ivory/5 rounded-xl text-xs">
                    <div>
                      <div className="font-semibold text-ivory">{item.productTitle}</div>
                      <div className="text-[11px] text-ivory/50 mt-0.5">
                        {item.variantName && <span>اللون: {item.variantName} · </span>}
                        {item.size && <span>المقاس: {item.size} · </span>}
                        <span>الكمية: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-terracotta">{formatPrice(item.price * item.quantity)}</div>
                      <div className="text-[10px] text-ivory/40">{formatPrice(item.price)} للقطعة</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="p-4 bg-espresso/80 rounded-2xl border border-ivory/5 space-y-2 text-xs">
              <div className="flex justify-between text-ivory/60">
                <span>المجموع الفرعي:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.bundleDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>خصم الأطقم المنسقة:</span>
                  <span>- {formatPrice(selectedOrder.bundleDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-ivory pt-2 border-t border-ivory/10">
                <span>الإجمالي النهائي:</span>
                <span className="text-terracotta">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Update Status Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-ivory/10">
              <div className="flex items-center gap-2 text-xs text-ivory/70 w-full sm:w-auto">
                <span>تحديث حالة الطلب:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as AdminOrder['status'])}
                  className="px-3 py-1.5 bg-espresso border border-terracotta/40 rounded-xl text-xs text-terracotta font-bold outline-none cursor-pointer"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="processing">جاري التجهيز</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-ivory/10 hover:bg-ivory/20 text-ivory text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

