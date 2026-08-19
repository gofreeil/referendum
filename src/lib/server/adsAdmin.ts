// ============================================================
// adsAdmin.ts — שערת הניהול של סטודיו הפרסומות
//
// עטיפה דקה מעל admin.ts הקיים: אותו מנגנון תפקידים בדיוק
// (super_admin גלובלי / ref_admin מקומי) — בלי לשכפל את הלוגיקה.
// ההבדל היחיד: יעד ה-redirect למי שלא מחובר הוא מסך הפרסומות.
// כל פעולת ניהול — אישור/דחייה/השהיה/קציבה/סידור — חייבת לעבור
// כאן, בצד השרת.
// ============================================================

import { error, redirect } from '@sveltejs/kit';
import { resolveRole, type AdminRole, type AdminContext } from './admin';

export { resolveRole, requireSuperAdmin, OWNER_EMAIL } from './admin';
export type { AdminRole, AdminContext } from './admin';

/** שולף את הסשן ומוודא הרשאת ניהול. לשימוש ב-load ובכל action של /admin/ads. */
export async function getAdminContext(locals: App.Locals): Promise<AdminContext> {
	const session = await locals.auth();
	if (!session?.user) throw redirect(302, '/login?redirect=/admin/ads');
	const role: AdminRole | null = await resolveRole(session);
	if (!role) throw error(403, 'אין לך הרשאת גישה לניהול הפרסומות');
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
