// ============================================================
// חיפוש משתמשים רשומים (לסופר-אדמין) — עבור החיפוש החי במסך ניהול האדמינים.
// מחפש ברשימת המשתמשים המאוחדת של ה-Strapi המשותף (api.gofreeil.com):
//   1. שאילתת $containsi על email/username/nickname (השדות המובטחים בסכמה).
//   2. אם אין תוצאות (למשל חיפוש שם בעברית שלא קיים ב-username) —
//      סריקה מקומית של כל שדות הטקסט ברשומות, בדפדוף מוגבל.
// ============================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getAdminContext,
	hasAdminToken,
	requireSuperAdmin,
	searchUsersDeep
} from '$lib/server/admin';

export const GET: RequestHandler = async ({ locals, url }) => {
	const { role } = await getAdminContext(locals);
	requireSuperAdmin(role);

	const q = (url.searchParams.get('q') ?? '').trim();
	if (q.length < 2 || !hasAdminToken()) return json({ users: [] });

	try {
		return json({ users: await searchUsersDeep(q) });
	} catch (e) {
		console.error('[admin] user search failed:', e);
		return json({ users: [], error: 'החיפוש ברשימת המשתמשים נכשל — אפשר לחפש שוב' });
	}
};
