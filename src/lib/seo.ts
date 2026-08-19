// ============================================================
// seo.ts — מקור אמת יחיד לזהות האתר בדפי הפרסום (canonical, og:*)
// גרסה רזה של המודול המקביל בפינת האבדות — רק מה שדפי /advertise
// צורכים. הרחבה עתידית (schema.org וכו') תיכנס לכאן.
// ============================================================

/** הדומיין הקנוני היחיד. כל canonical / og:url מצביעים לכאן. */
export const SITE_URL = 'https://referendum.gofreeil.com';
export const SITE_NAME = 'משאלי העם';
export const SITE_TAGLINE = 'הקול שלך נספר';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/referendum-logo.png`;

/** בונה URL מוחלט קנוני מנתיב יחסי. */
export function canonical(path = '/'): string {
	if (!path.startsWith('/')) path = '/' + path;
	return path === '/' ? SITE_URL : SITE_URL + path;
}
