/**
 * Legacy Supabase service file.
 * The application uses Prisma API client (/api/products, /api/categories, /api/orders) on Vercel.
 */
export async function ensureDatabaseSeeded() {}
export async function getDbCategories() { return []; }
export async function getDbProducts() { return []; }
export async function createDbOrder(input: any) { return { id: `MENIH-${Date.now()}` }; }
