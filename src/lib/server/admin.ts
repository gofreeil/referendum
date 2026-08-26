// ============================================================
// admin.ts — תפקידי ניהול מעל רשימת המשתמשים המשותפת ב-Strapi
//
// מינוי אדמין = קביעת app_role על המשתמש (ref_admin), באותו מנגנון
// של שאר האתרים (idx_admin באינדקס, ch_admin בחכמי העדה): כל אתר
// מכבד רק את התפקיד שלו, ו-super_admin הוא גלובלי.
//
// זיהוי התפקיד של המשתמש המחובר לא דורש טוקן שרת — נקרא מ-/users/me
// עם ה-JWT האישי שבסשן. ניהול המינויים (חיפוש/רשימה/עדכון) דורש
// STRAPI_TOKEN בסביבת השרת.
// ============================================================

import { error, redirect } from '@sveltejs/kit';
import type { Session } from '@auth/sveltekit';
import { STRAPI_URL, getStrapiMe, bestStrapiName, friendlyName } from './strapiAuth';

export const OWNER_EMAIL = 'yahavanter@gmail.com';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN ?? '';

// רק תפקידי המשאלים — תפקידים של אתרים אחרים לא מוצגים ולא ניתנים למינוי מכאן
export const ADMIN_ROLES = ['super_admin', 'ref_admin'] as const;
export const ASSIGNABLE = ['super_admin', 'ref_admin', 'user'] as const;
export type AdminRole = 'super_admin' | 'ref_admin';

export interface SlimUser {
	id: number;
	name: string;
	email: string;
	app_role: string;
	created_at: string;
	registered_site: string;
}

export interface AdminContext {
	user: { id: string; name: string; email: string };
	role: AdminRole;
	superAdmin: boolean;
}

/**
 * התפקיד של המשתמש המחובר: בעל האתר תמיד סופר-אדמין (גם בלי טוקן וגם אם
 * Strapi לא זמין); אחרת לפי app_role על הרשומה המשותפת, דרך ה-JWT שבסשן.
 */
export async function resolveRole(session: Session | null): Promise<AdminRole | null> {
	const u = session?.user;
	if (!u) return null;
	if ((u.email ?? '').trim().toLowerCase() === OWNER_EMAIL) return 'super_admin';
	if (!u.strapiJwt) return null;
	const me = await getStrapiMe(u.strapiJwt);
	if (me?.app_role === 'super_admin') return 'super_admin';
	if (me?.app_role === 'ref_admin') return 'ref_admin';
	return null;
}

/** שולף את הסשן ומוודא הרשאת ניהול. לשימוש ב-load של מסלולי /admin. */
export async function getAdminContext(locals: App.Locals): Promise<AdminContext> {
	const session = await locals.auth();
	if (!session?.user) throw redirect(302, '/login?redirect=/admin');
	const role = await resolveRole(session);
	if (!role) throw error(403, 'אין לך הרשאת גישה לפאנל הניהול');
	return {
		user: {
			id: session.user.id ?? '',
			name: session.user.name ?? '',
			email: session.user.email ?? ''
		},
		role,
		superAdmin: role === 'super_admin'
	};
}

export function requireSuperAdmin(role: AdminRole): void {
	if (role !== 'super_admin') throw error(403, 'פעולה זו מותרת לסופר-אדמין בלבד');
}

// ── ניהול המינויים (דורש טוקן שרת) ──

/** האם מוגדר טוקן שרת — בלעדיו מסך המינויים מציג הסבר במקום להיכשל בשקט */
export function hasAdminToken(): boolean {
	return Boolean(STRAPI_TOKEN);
}

async function api(path: string, init: RequestInit = {}): Promise<unknown> {
	const res = await fetch(STRAPI_URL + path, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${STRAPI_TOKEN}`,
			...(init.headers ?? {})
		}
	});
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`Strapi ${res.status}: ${text.slice(0, 160)}`);
	}
	return res.json();
}

// אובייקט המשתמש המלא מכיל שדות רגישים — ללקוח עוברת צורה רזה בלבד
function toSlim(u: Record<string, unknown>): SlimUser {
	const raw = u as {
		id: number;
		email?: string;
		app_role?: string;
		createdAt?: string;
		registered_site?: string;
	};
	return {
		id: raw.id,
		name: friendlyName(bestStrapiName(u), raw.email),
		email: raw.email ?? '',
		app_role: raw.app_role || 'user',
		created_at: raw.createdAt ?? '',
		registered_site: raw.registered_site ?? ''
	};
}

/** כל המשתמשים בעלי תפקיד ניהולי של המשאלים */
export async function listAdminUsers(): Promise<SlimUser[]> {
	const qs =
		ADMIN_ROLES.map((r, i) => `filters[app_role][$in][${i}]=${r}`).join('&') +
		'&pagination[pageSize]=200&sort=id:asc';
	const arr = await api(`/api/users?${qs}`);
	return (Array.isArray(arr) ? arr : []).map(toSlim);
}

/** חיפוש משתמשים למינוי — לפי אימייל / שם משתמש / כינוי */
export async function searchUsers(q: string): Promise<SlimUser[]> {
	const enc = encodeURIComponent(q);
	const qs =
		`filters[$or][0][email][$containsi]=${enc}` +
		`&filters[$or][1][username][$containsi]=${enc}` +
		`&filters[$or][2][nickname][$containsi]=${enc}` +
		'&pagination[pageSize]=20&sort=id:desc';
	const arr = await api(`/api/users?${qs}`);
	return (Array.isArray(arr) ? arr : []).map(toSlim);
}

// חיפוש עמוק — דפדוף מוגבל וסריקה מקומית כשהשאילתה המסוננת לא מצאה כלום
const SCAN_PAGE_SIZE = 1000; // maxLimit של השרת
const MAX_SCAN = 5000; // תקרת רשומות לסריקה המקומית
const MAX_RESULTS = 10;

// ── התאמה עמומה (שגיאות כתיב) ──

/** מרחק לוינשטיין קלאסי, שתי שורות בלבד */
function levenshtein(a: string, b: string): number {
	if (a === b) return 0;
	if (!a.length) return b.length;
	if (!b.length) return a.length;
	let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const cur = [i];
		for (let j = 1; j <= b.length; j++) {
			cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
		}
		prev = cur;
	}
	return prev[b.length];
}

/** כמה שגיאות כתיב מרשים לפי אורך החיפוש */
function typoBudget(len: number): number {
	if (len <= 4) return 1;
	if (len <= 7) return 2;
	return 3;
}

/**
 * המרחק העמום המינימלי בין החיפוש לרשומה: מושווה מול כל ערכי הטקסט,
 * מול החלק שלפני ה-@ במיילים, מול פיצול למילים, ומול קידומת באורך
 * החיפוש (כדי שגם הקלדה חלקית עם טעות תיתפס).
 */
function fuzzyDistance(u: Record<string, unknown>, q: string): number {
	const budget = typoBudget(q.length);
	let best = Infinity;
	for (const raw of Object.values(u)) {
		if (typeof raw !== 'string' || !raw) continue;
		const v = raw.toLowerCase();
		const candidates = new Set<string>([v]);
		if (v.includes('@')) candidates.add(v.split('@')[0]);
		for (const tok of v.split(/[@._\-\s]+/)) if (tok.length >= 2) candidates.add(tok);
		for (const c of candidates) {
			// גם מול הערך המלא וגם מול קידומת באורך החיפוש
			const d = Math.min(
				levenshtein(q, c),
				c.length > q.length ? levenshtein(q, c.slice(0, q.length)) : Infinity,
				c.length > q.length + 1 ? levenshtein(q, c.slice(0, q.length + 1)) : Infinity
			);
			if (d < best) best = d;
			if (best === 0) return 0;
		}
	}
	return best <= budget ? best : Infinity;
}

export interface DeepSearchResult {
	users: SlimUser[];
	/** true כשאין אף התאמה מדויקת והתוצאות הן "דומים" (שגיאת כתיב) */
	fuzzy: boolean;
}

/**
 * חיפוש משתמשים לחיפוש החי: קודם השאילתה המסוננת של Strapi
 * (email/username/nickname); אם היא נכשלה או לא מצאה — סריקה מקומית של כל
 * שדות הטקסט ברשומות, בדפדוף מוגבל. תופסת גם שמות בעברית ושדות לא-סטנדרטיים.
 * אין התאמה מדויקת בכלל? — מוחזרים הדומים ביותר (מרחק לוינשטיין) עם דגל
 * fuzzy, כדי ששגיאת כתיב ("ahuvhnd1") עדיין תציע את ("ahuvahnd1@gmail.com").
 */
export async function searchUsersDeep(q: string): Promise<DeepSearchResult> {
	const filtered = await searchUsers(q).catch(() => [] as SlimUser[]);
	if (filtered.length > 0) return { users: filtered.slice(0, MAX_RESULTS), fuzzy: false };

	const needle = q.toLowerCase();
	const matches: SlimUser[] = [];
	const fuzzyHits: { u: Record<string, unknown>; d: number }[] = [];
	for (let start = 0; start < MAX_SCAN; start += SCAN_PAGE_SIZE) {
		const arr = await api(
			`/api/users?pagination[start]=${start}&pagination[limit]=${SCAN_PAGE_SIZE}`
		);
		const batch = Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
		for (const u of batch) {
			const hit = Object.values(u).some(
				(v) => typeof v === 'string' && v.toLowerCase().includes(needle)
			);
			if (hit) {
				matches.push(toSlim(u));
			} else {
				const d = fuzzyDistance(u, needle);
				if (d !== Infinity) fuzzyHits.push({ u, d });
			}
			if (matches.length >= MAX_RESULTS) break;
		}
		if (batch.length < SCAN_PAGE_SIZE || matches.length >= MAX_RESULTS) break;
	}
	// אין התאמה מדויקת — מציעים את הדומים ביותר, לפי מרחק עולה
	if (matches.length === 0 && fuzzyHits.length > 0) {
		return {
			users: fuzzyHits
				.sort((a, b) => a.d - b.d)
				.slice(0, MAX_RESULTS)
				.map((h) => toSlim(h.u)),
			fuzzy: true
		};
	}
	return { users: matches, fuzzy: false };
}

/** משתמש בודד (רזה) לבדיקות הגנה לפני שינוי תפקיד */
export async function getUserSlim(userId: string | number): Promise<SlimUser | null> {
	try {
		const u = await api(`/api/users/${encodeURIComponent(String(userId))}`);
		return u && typeof u === 'object' && 'id' in u ? toSlim(u as Record<string, unknown>) : null;
	} catch {
		return null;
	}
}

/** קביעת app_role למשתמש. users-permissions מצפה לגוף שטוח (בלי עטיפת data). */
export async function setUserRole(userId: string | number, role: string): Promise<void> {
	await api(`/api/users/${encodeURIComponent(String(userId))}`, {
		method: 'PUT',
		body: JSON.stringify({ app_role: role })
	});
}
