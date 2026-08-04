import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	ASSIGNABLE,
	OWNER_EMAIL,
	getAdminContext,
	getUserSlim,
	hasAdminToken,
	listAdminUsers,
	requireSuperAdmin,
	resolveRole,
	searchUsers,
	setUserRole
} from '$lib/server/admin';

// מסך מינוי אדמינים — לסופר-אדמין בלבד. מינוי = קביעת app_role על המשתמש
// ברשימת המשתמשים המשותפת של Strapi (אותו מנגנון כמו בשאר האתרים).

export const load: PageServerLoad = async ({ locals, url }) => {
	const ctx = await getAdminContext(locals);
	requireSuperAdmin(ctx.role);

	if (!hasAdminToken()) {
		return { user: ctx.user, tokenMissing: true, admins: [], q: '', results: [] };
	}

	const q = (url.searchParams.get('q') || '').trim();
	const [admins, results] = await Promise.all([
		listAdminUsers().catch(() => []),
		q.length >= 2 ? searchUsers(q).catch(() => []) : Promise.resolve([])
	]);
	return { user: ctx.user, tokenMissing: false, admins, q, results };
};

export const actions: Actions = {
	setRole: async ({ request, locals }) => {
		const session = await locals.auth();
		if ((await resolveRole(session)) !== 'super_admin') {
			return fail(403, { error: 'פעולה זו לסופר-אדמין בלבד' });
		}
		if (!hasAdminToken()) {
			return fail(500, { error: 'STRAPI_TOKEN אינו מוגדר בסביבת השרת' });
		}
		const fd = await request.formData();
		const userId = String(fd.get('userId') || '');
		const role = String(fd.get('role') || '');
		if (!userId || !(ASSIGNABLE as readonly string[]).includes(role)) {
			return fail(400, { error: 'בקשה לא תקינה' });
		}

		const target = await getUserSlim(userId);
		if (!target) return fail(404, { error: 'המשתמש לא נמצא' });

		// הגנות: לא משנים את עצמך (נעילה-עצמית בטעות) ולא את בעל האתר.
		// ההשוואה גם לפי אימייל — בכניסת OAuth מזהה הסשן אינו מזהה ה-Strapi.
		const myEmail = (session?.user?.email ?? '').trim().toLowerCase();
		const targetEmail = target.email.trim().toLowerCase();
		if (userId === String(session?.user?.id ?? '') || (myEmail && targetEmail === myEmail)) {
			return fail(400, { error: 'אי אפשר לשנות את התפקיד של עצמך' });
		}
		if (targetEmail === OWNER_EMAIL) {
			return fail(400, { error: 'אי אפשר לשנות את בעל האתר' });
		}
		// app_role הוא שדה אחד לכל האתרים — מינוי כאן היה דורס תפקיד של אתר
		// אחר (idx_admin, ch_admin וכד'). תפקידים זרים מנהלים רק מהאתר שלהם.
		if (!(ASSIGNABLE as readonly string[]).includes(target.app_role)) {
			return fail(400, {
				error: `למשתמש יש תפקיד באתר אחר (${target.app_role}) — יש לנהל אותו מהאתר שלו`
			});
		}

		try {
			await setUserRole(userId, role);
		} catch (e) {
			return fail(502, {
				error: 'עדכון התפקיד נכשל: ' + (e instanceof Error ? e.message.slice(0, 160) : '')
			});
		}
		const labels: Record<string, string> = {
			super_admin: 'מונה לסופר-אדמין',
			ref_admin: 'מונה לאדמין המשאלים',
			user: 'הוסר מתפקיד ניהולי'
		};
		return { success: true, message: `${target.name || target.email} — ${labels[role]}` };
	}
};
