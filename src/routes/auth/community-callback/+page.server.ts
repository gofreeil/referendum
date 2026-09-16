import type { PageServerLoad } from './$types';
import { oauthEnabled } from '../../../auth';

export const load: PageServerLoad = async ({ url }) => {
	const raw = url.searchParams.get('returnTo') ?? '/';
	const returnTo = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
	return { returnTo, error: url.searchParams.get('error'), oauth: oauthEnabled };
};
