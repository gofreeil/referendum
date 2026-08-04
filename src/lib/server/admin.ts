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
