import type { Product, Category, CategoryInfo } from './mockData';
import type { SiteSettings, TestimonialItem, AdminOrder } from './adminService';

const API_BASE = '/api';

// ----------------- Categories -----------------
export async function fetchCategories(): Promise<CategoryInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.map((c: any) => ({
      id: c.slug as Category,
      name: c.name,
      nameAr: c.nameAr,
      description: c.description || '',
      descriptionAr: c.descriptionAr || '',
      image: c.image || '',
    }));
  } catch (err) {
    console.error('API Error (fetchCategories):', err);
    return [];
  }
}

export async function createCategoryApi(data: Partial<CategoryInfo> & { name: string; nameAr: string; slug?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategoryApi(id: string, data: Partial<CategoryInfo>): Promise<any> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCategoryApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ----------------- Products -----------------
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchProducts):', err);
    return [];
  }
}

export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${handle}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchProductByHandle):', err);
    return null;
  }
}

export async function saveProductApi(productData: any, isEdit = false): Promise<any> {
  const url = isEdit ? `${API_BASE}/products/${productData.id}` : `${API_BASE}/products`;
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return res.json();
}

export async function deleteProductApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ----------------- Orders -----------------
export async function fetchOrders(): Promise<AdminOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchOrders):', err);
    return [];
  }
}

export async function createOrderApi(orderData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
}

export async function updateOrderStatusApi(id: string, status: string): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteOrderApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ----------------- Site Settings -----------------
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchSiteSettings):', err);
    throw err;
  }
}

export async function updateSiteSettingsApi(settings: SiteSettings): Promise<any> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return res.json();
}

// ----------------- Testimonials -----------------
export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchTestimonials):', err);
    return [];
  }
}

export async function saveTestimonialApi(testiData: any, isEdit = false): Promise<any> {
  const url = isEdit ? `${API_BASE}/testimonials/${testiData.id}` : `${API_BASE}/testimonials`;
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testiData),
  });
  return res.json();
}

export async function deleteTestimonialApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/testimonials/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ----------------- Email System -----------------
export async function fetchEmailStatusApi(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/email-status`);
    if (!res.ok) throw new Error('Failed to fetch email status');
    return await res.json();
  } catch (err) {
    return {
      isConfigured: false,
      mode: 'mock',
      adminEmail: 'admin@maison-manie.com',
      provider: 'Mock / Sandbox Mode (Simulated)',
    };
  }
}

export async function sendTestEmailApi(targetEmail?: string, apiKey?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/test-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetEmail, apiKey }),
  });
  return res.json();
}

// ----------------- Admin Auth -----------------
export async function verifyAdminPasscodeApi(passcode: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data?.success;
  } catch (err) {
    console.error('Passcode verification error:', err);
    return false;
  }
}
