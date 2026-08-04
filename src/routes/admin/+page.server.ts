import type { PageServerLoad } from './$types';
import { getAdminContext } from '$lib/server/admin';
import { issues } from '$lib/referendumData';

// דשבורד הפאנל — פתוח לאדמין ולסופר-אדמין. תוכן הסוגיות מנוהל בקוד
// (referendumData.ts), ולכן הפאנל מציג תמונת-מצב; מסכי עריכה יתווספו
// כשהתוכן יעבור ל-DB.

export const load: PageServerLoad = async ({ locals }) => {
	const ctx = await getAdminContext(locals);

	const byStatus = (s: string) => issues.filter((i) => i.status === s).length;
	return {
		user: ctx.user,
		role: ctx.role,
		superAdmin: ctx.superAdmin,
		stats: {
			issues: issues.length,
			active: byStatus('פעיל'),
			ended: byStatus('הסתיים'),
			upcoming: byStatus('בקרוב'),
			totalVotes: issues.reduce((sum, i) => sum + (i.totalVotes || 0), 0),
			experts: issues.reduce((sum, i) => sum + i.experts.length, 0),
			teams: issues.reduce((sum, i) => sum + i.teams.length, 0)
		},
		issues: issues.map((i) => ({
			slug: i.slug,
			title: i.title,
			category: i.category,
			status: i.status,
			deadline: i.deadline,
			totalVotes: i.totalVotes
		}))
	};
};
