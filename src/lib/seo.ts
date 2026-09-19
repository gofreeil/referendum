// ============================================================
// seo.ts — מקור אמת יחיד לזהות האתר בדפי הפרסום (canonical, og:*)
// גרסה רזה של המודול המקביל בפינת האבדות — רק מה שדפי /advertise
// צורכים. הרחבה עתידית (schema.org וכו') תיכנס לכאן.
// ============================================================

/** הדומיין הקנוני היחיד. כל canonical / og:url מצביעים לכאן. */
export const SITE_URL = 'https://referendum.gofreeil.com';
export const SITE_NAME = 'משאלי העם';
export const SITE_TAGLINE = 'הקול שלך נספר';
/** שם התנועה-האם. מצורף לכל <title>, לתיאור ולסכימות — כדי שחיפוש
 *  "יוצאים לחירות משאלי העם" יגיע לכאן ולא לאתרים זרים בשם דומה. */
export const PARENT_BRAND = 'יוצאים לחירות';
export const PARENT_SITE = { name: PARENT_BRAND, url: 'https://gofreeil.com' };
export const SITE_DESCRIPTION =
	'משאלי העם של תנועת יוצאים לחירות — הבע דעתך על הסוגיות האקטואליות שעל סדר היום הציבורי בישראל: ניתוח צדדים, צוותי מומחים, הצבעה ציבורית ותוצאות חיות.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/referendum-logo.png`;

/** בונה URL מוחלט קנוני מנתיב יחסי. */
export function canonical(path = '/'): string {
	if (!path.startsWith('/')) path = '/' + path;
	return path === '/' ? SITE_URL : SITE_URL + path;
}

/**
 * סכמת FAQPage (schema.org) מרשימת שאלות-ותשובות — לדף אודותינו.
 * הטקסט חייב להיות זהה למה שמוצג בדף עצמו (מקור אמת: $lib/aboutFaq).
 */
export function faqSchema(items: { q: string; a: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((i) => ({
			'@type': 'Question',
			name: i.q,
			acceptedAnswer: { '@type': 'Answer', text: i.a }
		}))
	};
}

/** סכמת WebSite — שם האתר ושמותיו החלופיים (כולל השיוך לתנועה-האם). */
export function websiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${SITE_URL}/#website`,
		name: SITE_NAME,
		alternateName: [
			'משאלי העם של יוצאים לחירות',
			'יוצאים לחירות משאלי העם',
			'משאל עם',
			'gofreeil referendum'
		],
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		inLanguage: 'he-IL',
		publisher: { '@id': `${SITE_URL}/#organization` }
	};
}

/** סכמת Organization — האתר כמיזם של התנועה החברתית "יוצאים לחירות". */
export function organizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${SITE_URL}/#organization`,
		name: SITE_NAME,
		alternateName: ['משאלי העם של יוצאים לחירות', 'משאלי העם — יוצאים לחירות'],
		url: SITE_URL,
		logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
		parentOrganization: { '@type': 'Organization', name: PARENT_SITE.name, url: PARENT_SITE.url },
		sameAs: [PARENT_SITE.url]
	};
}
