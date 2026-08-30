/**
 * Everything lives in this browser. No account, no server, no database.
 *
 * That is a deliberate choice for a prototype: it removes sign-in, hosting and privacy
 * questions entirely, and cycle data is about as personal as data gets — not sending it
 * anywhere is the honest default.
 */
import type { SkinType, ClimateId } from './advice';
import type { Product } from './products';

export interface Profile {
  skinType: SkinType;
  cycleStartDate: string;
  cycleLength: number;
  climate: ClimateId;
}

const PROFILE_KEY = 'skincare-app:profile';
const PRODUCTS_KEY = 'skincare-app:products';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A full or blocked localStorage shouldn't take the app down with it.
  }
}

export const loadProfile = () => read<Profile | null>(PROFILE_KEY, null);
export const saveProfile = (p: Profile) => write(PROFILE_KEY, p);

export const loadProducts = () => read<Product[]>(PRODUCTS_KEY, []);
export const saveProducts = (p: Product[]) => write(PRODUCTS_KEY, p);

export function newId() {
  return 'p' + Math.random().toString(36).slice(2, 10);
}

/** A few products dated so the shelf shows fresh, low and empty at once. */
export function sampleProducts(): Product[] {
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };
  return [
    { id: newId(), name: 'Vitamin C serum', category: 'Serum', purchaseDate: daysAgo(18), lifespanDays: 60 },
    { id: newId(), name: 'Ceramide moisturiser', category: 'Moisturiser', purchaseDate: daysAgo(63), lifespanDays: 75 },
    { id: newId(), name: 'Daily SPF 50', category: 'SPF', purchaseDate: daysAgo(68), lifespanDays: 60 },
  ];
}
