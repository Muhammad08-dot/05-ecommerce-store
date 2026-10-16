/**
 * Standalone mock backend for the Halden storefront.
 *
 * The Django code in ../backend stays in the repo as a showcase, but the
 * deployed frontend is fully static: catalogue + pricing + orders + users all
 * live here, seeded once and persisted in localStorage so the cart, checkout,
 * account history and studio admin genuinely work with no server.
 */
import type {
  Category, Product, ProductDetail, CartQuote, CartLine, CartTotals, Order, User,
} from '@/lib/types';

// ---- Static catalogue (mirrors backend/seed.py, verified image URLs) ----

export const FREE_SHIPPING_CENTS = 12000;
export const FLAT_SHIPPING_CENTS = 900;
export const TAX_RATE = 0.08;

const CATS: [number, string, string, string][] = [
  [1, 'Ceramics', 'ceramics', 'Wheel-thrown stoneware and porcelain for daily rituals.'],
  [2, 'Textiles', 'textiles', 'Washed linen and undyed wool, woven in small runs.'],
  [3, 'Kitchen', 'kitchen', 'Considered tools and serving pieces for the table.'],
  [4, 'Lighting', 'lighting', 'Warm, dimmable light in brass, oak, and glass.'],
  [5, 'Bath', 'bath', 'Soft underfoot things for the morning and the evening.'],
];

const U = (pid: string) => `https://images.unsplash.com/photo-${pid}?auto=format&fit=crop&w=900&q=80`;

// id, name, catId, sku, material, price_cents, stock, featured, photoId, alt, desc, care
type Row = [number, string, number, string, string, number, number, boolean, string, string, string, string];
const ROWS: Row[] = [
  [1, 'Kite Serving Bowl', 1, 'HAL-CB-01', 'stoneware', 6800, 24, true, '1530006498959-b7884e829a04', 'Two pale handmade ceramic bowls on a white table', 'A generous, low bowl for salads, grain, or fruit. Thrown thin and dipped three times so the glaze pools around the ring marks, it is as happy on the table as it is on a shelf.', 'Dishwasher safe. Avoid direct flame.'],
  [2, 'Ridge Mug - Pair', 1, 'HAL-CB-02', 'stoneware', 4200, 40, true, '1514228742587-6b1558fcca3d', 'Two handmade speckled stoneware mugs on a wooden table', 'Our everyday mug, sold as a pair. A pronounced ridge wraps the lip where your thumb rests, and the unglazed foot keeps it grounded on the counter.', 'Dishwasher and microwave safe.'],
  [3, 'Halo Dinner Plate', 1, 'HAL-CB-03', 'porcelain', 3900, 30, false, '1621453571889-0b228e998080', 'Overhead view of a glazed round plate', 'A wide, rimmed plate with a soft reactive glaze that deepens toward the well. Each plate sits slightly proud of the last, so a stack reads like a set of rings.', 'Dishwasher safe. Handle the rim with care.'],
  [4, 'Halo Cup & Saucer', 1, 'HAL-CB-04', 'stoneware', 4600, 26, false, '1605117012605-b68dedd4accc', 'Brown ceramic cup resting on a pale saucer', 'A quiet pairing for a slow coffee. The cup is thrown with a thick base to hold the heat, the saucer cut slightly wider so a spoon has somewhere to rest.', 'Dishwasher safe.'],
  [5, 'Loom Linen Tea Towels - Set of 3', 2, 'HAL-TX-01', 'linen', 5200, 50, true, '1638232928539-6e91c47ddec5', 'A soft grey linen towel folded neatly', 'Three heavyweight linen towels that only get softer. Hemmed by hand and garment-washed, they dry fast and refuse to look precious.', 'Machine wash warm. Tumble dry low, or hang.'],
  [6, 'Undyed Wool Throw', 2, 'HAL-TX-02', 'wool', 18500, 8, true, '1634120455427-d4db69777fdc', 'Folded warm-toned wool blanket in close detail', 'A slow-woven throw in undyed fleece, so the colour is exactly what the sheep gave. Heavy enough to settle, light enough to carry to the sofa.', 'Dry clean only. Air between uses.'],
  [7, 'Nesting Prep Bowls - Set of 4', 3, 'HAL-KT-01', 'stoneware', 5800, 22, false, '1525973779373-015bdf68e579', 'Four round white ceramic bowls on a pale surface', 'Four bowls sized to nest: prep, mix, hold, serve. The matte white finish hides knife marks and the rims are thick enough to grip with a wet hand.', 'Dishwasher safe.'],
  [8, 'Oak Serving Board', 3, 'HAL-KT-02', 'oak', 7400, 20, true, '1666013942797-9daa4b8b3b4f', 'A blade resting on a pale oak board', 'A single slab of white oak, finished with food-safe oil and a thumb-hole for hanging. The grain runs long, so it carves as well as it serves.', 'Hand wash. Re-oil every few months.'],
  [9, 'Brass Measuring Spoons', 3, 'HAL-KT-03', 'brass', 4800, 28, false, '1556911220-bff31c812dba', 'Kitchen tools laid out on a stone counter', 'Solid brass, weighted so they level themselves, on a split ring that will not tangle. The finish darkens quietly with use.', 'Hand wash to keep the patina even.'],
  [10, 'Caster Table Light', 4, 'HAL-LG-01', 'brass', 16500, 10, true, '1667312939978-64cf31718a6e', 'A small warm lamp glowing beside a stack of books', 'A cordless little lamp for the corner of a table. Touch to raise or drop the light, and it holds a charge for about a full evening of dinner.', 'USB-C charging. Wipe with a dry cloth.'],
  [11, 'Marlow Side Lamp', 4, 'HAL-LG-02', 'brass', 12800, 9, false, '1506377295352-e3154d43ea9e', 'A white-shaded lamp lit on a side table', 'A low, warm pool of light for the reading chair. The linen shade takes the edge off the bulb, so the corner glows instead of glaring.', 'Fitted plug. Dry dust only.'],
  [12, 'Ash Glass Bud Vase', 3, 'HAL-KT-04', 'glass', 4600, 24, false, '1609210885628-4c6a41a8caf7', 'Clear glass vase holding stems on an oak surface', 'A hand-blown vase with a slight smoke to the glass, so dried grasses and single stems both read well in it. Weighted base, narrow enough for a posy.', 'Rinse by hand. No dishwasher.'],
  [13, 'Hatched Bath Towel', 5, 'HAL-BA-01', 'cotton', 6800, 20, false, '1616663717839-2fea42e1a1f6', 'Crisp white towels folded along a stone bathtub', 'A fast-drying hatch-weave towel with a heavy, looped pile. Big enough to wrap, dense enough to actually dry you.', 'Machine wash warm. Hang to dry.'],
  [14, 'Waffle Hand Towels - Set of 2', 5, 'HAL-BA-02', 'cotton', 4400, 42, false, '1651513825857-9fda9d5729fe', 'Folded towels and warm wood in a bright bathroom', 'Two loose waffle towels that dry a pair of hands in seconds and never feel stiff. Loop-hung for the rail, not the hook.', 'Machine wash warm. No fabric softener.'],
  [15, 'Draped Cotton Throw', 5, 'HAL-BA-03', 'cotton', 9600, 14, true, '1674475760738-8c7af859f821', 'A chunky blanket laid across a linen sofa', 'The catch-all throw for the arm of the chair or the end of the bed. Quilted cotton, machine washable, and soft without being precious.', 'Machine wash cold. Tumble low.'],
  [16, 'Studio Carafe', 1, 'HAL-CB-05', 'stoneware', 5800, 16, false, '1590605095243-072811dbe64c', 'A freshly thrown pale clay jug held in two hands', 'A two-litre jug with a pinched pour spout that cuts drips. The matte exterior stays cool and quiet on the table.', 'Hand wash recommended.'],
  [17, 'Clay Catchall Dish', 1, 'HAL-CB-06', 'stoneware', 2800, 48, false, '1571987530791-58e3e7744d99', 'Small clay dishes set on a pale tray', 'A palm-sized dish for the entryway — keys, rings, the week coins. Glazed inside, raw clay underneath so it grips the shelf.', 'Wipe clean.'],
  [18, 'Heavy Linen Cushion Cover', 2, 'HAL-TX-03', 'linen', 6200, 26, false, '1545042746-ec9e5a59b359', 'Soft neutral linen textile folded in layers', 'An envelope-back cover in stonewashed linen that fits a 45cm insert. Two thick layers in front, so the fill never shows through.', 'Machine wash cold. Iron damp if you like.'],
];

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const catById = new Map<number, Category>(CATS.map(([id, name, slug, blurb]) => [id, { id, name, slug, blurb, product_count: 0 }]));
export const categories: Category[] = CATS.map(([id, name, slug, blurb]) => ({ id, name, slug, blurb, product_count: 0 }));
categories.forEach((c) => { c.product_count = ROWS.filter((r) => r[2] === c.id).length; });

interface Full extends ProductDetail {}
const BASE: Full[] = ROWS.map(([id, name, catId, sku, material, price_cents, stock, featured, pid, alt, desc, care]) => {
  const cat = catById.get(catId)!;
  return {
    id, name, slug: slugify(name), sku, category: catId, category_name: cat.name, category_slug: cat.slug,
    material, price: (price_cents / 100).toFixed(2), price_cents, image_url: U(pid), image_alt: alt,
    description: desc, care, stock, in_stock: stock > 0, featured, is_active: true,
    created_at: new Date(Date.now() - id * 86400000).toISOString(),
  };
});

// ---- localStorage-backed mutable DB ----

const PKEY = 'halden.products.v1';
const OKEY = 'halden.orders.v1';
const UKEY = 'halden.users.v1';
const SKEY = 'halden.session.v1';
export const CART = 'halden.cart';
export const LAST_ORDER = 'halden.lastOrder';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; }
  catch { return fallback; }
}
function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function products(): Full[] {
  const stored = read<Full[] | null>(PKEY, null);
  if (stored && stored.length) return stored;
  write(PKEY, BASE);
  return BASE.slice();
}
function saveProducts(rows: Full[]) { write(PKEY, rows); }

function nextId(rows: Full[]) { return Math.max(0, ...rows.map((r) => r.id)) + 1; }

export function listProducts(opts: {
  category?: string; search?: string; material?: string; ordering?: string;
  featured?: boolean; includeInactive?: boolean;
} = {}): Product[] {
  let rows = products();
  if (!opts.includeInactive) rows = rows.filter((r) => r.is_active);
  if (opts.category && opts.category !== 'all') rows = rows.filter((r) => r.category_slug === opts.category);
  if (opts.featured) rows = rows.filter((r) => r.featured);
  if (opts.material) rows = rows.filter((r) => r.material === opts.material);
  if (opts.search) {
    const q = opts.search.toLowerCase();
    rows = rows.filter((r) => [r.name, r.sku, r.description].some((f) => f.toLowerCase().includes(q)));
  }
  const dir = opts.ordering?.startsWith('-') ? -1 : 1;
  const key = (opts.ordering || '-created_at').replace('-', '') as keyof Full;
  rows = rows.slice().sort((a, b) => {
    const av = a[key as keyof Full]; const bv = b[key as keyof Full];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
  return rows.map(toList);
}

function toList(p: Full): Product {
  return {
    id: p.id, name: p.name, slug: p.slug, sku: p.sku, category: p.category,
    category_name: p.category_name, material: p.material, price: p.price,
    image_url: p.image_url, image_alt: p.image_alt, in_stock: p.in_stock, featured: p.featured,
  };
}

export function getProduct(slug: string): ProductDetail | undefined {
  return products().find((p) => p.slug === slug);
}
export function listAllForAdmin(): ProductDetail[] {
  return products().slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function upsertProduct(slug: string | null, patch: Partial<ProductDetail>): ProductDetail {
  const rows = products();
  if (slug) {
    const p = rows.find((r) => r.slug === slug);
    if (!p) throw new Error('Product not found.');
    Object.assign(p, patch);
    p.price_cents = patch.price_cents != null ? patch.price_cents : p.price_cents;
    p.price = (p.price_cents / 100).toFixed(2);
    p.in_stock = p.stock > 0;
    p.slug = patch.name ? slugify(patch.name) : p.slug;
    saveProducts(rows);
    return p;
  }
  const cat = catById.get(Number(patch.category)) || categories[0];
  const created: Full = {
    id: nextId(rows), name: patch.name || 'Untitled piece', slug: slugify(patch.name || 'untitled'),
    sku: patch.sku || `HAL-NEW-${Date.now() % 1000}`, category: cat.id, category_name: cat.name, category_slug: cat.slug,
    material: patch.material || 'stoneware', price_cents: patch.price_cents || 0, price: ((patch.price_cents || 0) / 100).toFixed(2),
    image_url: patch.image_url || U('1530006498959-b7884e829a04'), image_alt: patch.image_alt || patch.name || 'Product photo',
    description: patch.description || '', care: patch.care || '', stock: patch.stock || 0, in_stock: (patch.stock || 0) > 0,
    featured: !!patch.featured, is_active: patch.is_active !== false, created_at: new Date().toISOString(),
  };
  rows.push(created); saveProducts(rows); return created;
}

export function deleteProduct(slug: string) {
  const rows = products().filter((r) => r.slug !== slug);
  saveProducts(rows);
}

// ---- Cart pricing (authoritative, mirrors backend rules) ----

export function priceCart(items: { product_id: number; qty: number }[]): CartQuote {
  const rows = products();
  const lines: CartLine[] = [];
  for (const it of items) {
    const p = rows.find((r) => r.id === it.product_id);
    if (!p) throw new Error(`Product ${it.product_id} is no longer available.`);
    if (!p.is_active || p.stock <= 0) throw new Error(`${p.name} is not available.`);
    const qty = Math.min(it.qty, p.stock);
    lines.push({
      product_id: p.id, name: p.name, slug: p.slug, sku: p.sku, image_url: p.image_url,
      unit_price_cents: p.price_cents, qty, line_total_cents: p.price_cents * qty,
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.line_total_cents, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const tax = Math.round(subtotal * TAX_RATE);
  const totals: CartTotals = {
    subtotal_cents: subtotal, shipping_cents: shipping, tax_cents: tax,
    grand_total_cents: subtotal + shipping + tax,
  };
  return { lines, totals };
}

// ---- Orders ----

function orders(): Order[] { return read<Order[]>(OKEY, []); }
function saveOrders(rows: Order[]) { write(OKEY, rows); }

function nextReference() {
  const year = new Date().getFullYear();
  const n = orders().length + 1;
  return `HD-${year}-${String(n).padStart(4, '0')}`;
}

export function createOrder(input: {
  email: string; shipping_name: string; shipping_address: string;
  shipping_city: string; shipping_postal: string; shipping_country: string;
  items: { product_id: number; qty: number }[];
}): { order: Order; simulated: boolean } {
  const { lines, totals } = priceCart(input.items);
  const rows = products();
  // Decrement stock for what was purchased.
  for (const l of lines) {
    const p = rows.find((r) => r.id === l.product_id);
    if (p) { p.stock = Math.max(0, p.stock - l.qty); p.in_stock = p.stock > 0; }
  }
  saveProducts(rows);

  const order: Order = {
    id: orders().length + 1, reference: nextReference(),
    email: input.email, shipping_name: input.shipping_name, shipping_address: input.shipping_address,
    shipping_city: input.shipping_city, shipping_postal: input.shipping_postal, shipping_country: input.shipping_country,
    status: 'paid', status_display: 'Paid',
    subtotal_cents: totals.subtotal_cents, shipping_cents: totals.shipping_cents,
    tax_cents: totals.tax_cents, grand_total_cents: totals.grand_total_cents,
    items: lines.map((l, i) => ({
      id: i + 1, product: l.product_id, name: l.name, sku: l.sku,
      unit_price_cents: l.unit_price_cents, qty: l.qty, line_total_cents: l.line_total_cents,
    })),
    created_at: new Date().toISOString(),
  };
  const all = orders(); all.push(order); saveOrders(all);
  return { order, simulated: true };
}

export function ordersFor(email: string): Order[] {
  return orders().filter((o) => o.email.toLowerCase() === email.toLowerCase()).sort((a, b) => b.id - a.id);
}

// ---- Users + session ----

interface StoredUser extends User { password: string }
function users(): StoredUser[] {
  const stored = read<StoredUser[] | null>(UKEY, null);
  if (stored && stored.length) return stored;
  const seeded: StoredUser[] = [
    { id: 1, email: 'studio@halden.co', first_name: 'Ada', last_name: 'Reyes', role: 'admin', is_admin_role: true, password: 'HaldenAdmin#1' },
    { id: 2, email: 'shopper@halden.co', first_name: 'Leo', last_name: 'Bennett', role: 'customer', is_admin_role: false, password: 'Shopper#2025' },
  ];
  write(UKEY, seeded);
  return seeded;
}
function publicUser(u: StoredUser): User {
  const { password: _pw, ...rest } = u; return rest;
}

export function login(email: string, password: string): User {
  const u = users().find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) throw new Error('We couldn’t match that email and password.');
  setSession(publicUser(u));
  return publicUser(u);
}

export function register(input: { email: string; first_name: string; last_name: string; password: string }): User {
  const list = users();
  if (list.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('An account with that email already exists.');
  }
  const id = Math.max(0, ...list.map((u) => u.id)) + 1;
  const created: StoredUser = { id, ...input, role: 'customer', is_admin_role: false };
  list.push(created);
  write(UKEY, list);
  setSession(publicUser(created));
  return publicUser(created);
}

export function currentUser(): User | null {
  return read<User | null>(SKEY, null);
}

export function setSession(u: User | null) {
  if (typeof window === 'undefined') return;
  if (u) write(SKEY, u);
  else localStorage.removeItem(SKEY);
}
