<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	// שדה החיפוש נזרע מ-q שב-URL בטעינה בלבד — עריכה חיה עד שליחת הטופס (GET)
	// svelte-ignore state_referenced_locally
	let q = $state(data.q ?? '');
	let busy = $state('');

	const ROLE_HE: Record<string, [string, string]> = {
		super_admin: ['👑 סופר-אדמין', 'bg-amber-500/10 text-amber-300 border-amber-500/40'],
		ref_admin: ['🛡️ אדמין המשאלים', 'bg-blue-500/10 text-blue-300 border-blue-500/40'],
		user: ['משתמש רגיל', 'bg-white/5 text-gray-300 border-white/20']
	};
	// תפקיד של אתר אחר (idx_admin, ch_admin וכד') — לא מנוהל מכאן
	const foreignRole = (u: { app_role?: string }) => u.app_role && !(u.app_role in ROLE_HE);
	const roleHe = (r: string): [string, string] =>
		ROLE_HE[r] ?? [r, 'bg-white/5 text-gray-300 border-white/20'];

	const fmtDate = (iso: string) => {
		if (!iso) return '';
		try {
			return new Date(iso).toLocaleDateString('he-IL', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit'
			});
		} catch {
			return '';
		}
	};

	const OWNER = 'yahavanter@gmail.com';
	/** המשתמש מוגן משינוי (בעל האתר / אתה עצמך) */
	const isProtected = (u: { email?: string; id: number }) =>
		u.email?.toLowerCase() === OWNER ||
		String(u.id) === String(data.user?.id) ||
		(!!u.email && u.email.toLowerCase() === data.user?.email?.toLowerCase());

	// ── חיפוש חי בין המשתמשים הרשומים ──
	// שליפה מושהית (350ms) מ-/admin/admins/search, עם שומר תגובות-ישנות (מונה רצף).
	// שליחת הטופס (GET) עדיין עובדת כרגיל — החיפוש החי רק חוסך את הרענון.
	interface LiveUser {
		id: number;
		name: string;
		email: string;
		app_role?: string;
		registered_site?: string;
	}
	let liveResults: LiveUser[] | null = $state(null);
	let searching = $state(false);
	let searchSeq = 0;
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function onSearchInput() {
		clearTimeout(debounceTimer);
		const term = q.trim();
		if (term.length < 2) {
			searching = false;
			liveResults = null;
			return;
		}
		searching = true;
		debounceTimer = setTimeout(async () => {
			const seq = ++searchSeq;
			try {
				const res = await fetch(`/admin/admins/search?q=${encodeURIComponent(term)}`);
				const body = await res.json();
				if (seq !== searchSeq) return; // תגובה ישנה — כבר הוקלד משהו אחר
				liveResults = Array.isArray(body?.users) ? body.users : [];
			} catch {
				if (seq === searchSeq) liveResults = null;
			} finally {
				if (seq === searchSeq) searching = false;
			}
		}, 350);
	}

	// תוצאות החיפוש בלי מי שכבר אדמין (מופיע ברשימה למעלה).
	// כשיש תוצאות חיות — הן קודמות לתוצאות שהגיעו מהשרת בטעינת הדף.
	const adminIds = $derived(new Set(data.admins.map((a: { id: number }) => a.id)));
	const activeQ = $derived(liveResults !== null ? q.trim() : (data.q ?? ''));
	const searchResults = $derived(
		((liveResults ?? data.results ?? []) as LiveUser[]).filter((u) => !adminIds.has(u.id))
	);

	const submitFn = (id: string) => () => {
		busy = id;
		return async ({ update }: { update: (o?: { reset?: boolean }) => Promise<void> }) => {
			await update({ reset: false });
			busy = '';
		};
	};
</script>

<svelte:head>
	<title>ניהול אדמינים — משאלי העם</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto max-w-4xl px-4 py-8" dir="rtl">
	<div class="mb-6 flex items-center justify-between gap-3">
		<div>
			<h1 class="text-2xl font-black text-white">👥 ניהול אדמינים</h1>
			<p class="mt-1 text-sm text-gray-400">
				מינוי והסרה של אדמינים לאתר הזה — לסופר-אדמין בלבד. לכל אתר אדמינים משלו; תפקידים של
				אתרים אחרים לא מוצגים ולא ניתנים לשינוי מכאן.
			</p>
		</div>
		<a href="/admin" class="flex-shrink-0 text-sm text-gray-400 hover:text-blue-300">← לפאנל</a>
	</div>

	{#if data.tokenMissing}
		<div class="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
			<b>STRAPI_TOKEN אינו מוגדר בסביבת השרת.</b>
			כדי לחפש משתמשים ולמנות אדמינים יש להגדיר בפריסה משתנה סביבה
			<code dir="ltr" class="rounded bg-black/30 px-1">STRAPI_TOKEN</code>
			עם טוקן API של ה-Strapi המשותף (כמו באתר האינדקס).
		</div>
	{:else}
		{#if form?.success}
			<div
				class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-emerald-300"
			>
				✓ {form.message}
			</div>
		{/if}
		{#if form?.error}
			<div class="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-red-300">
				{form.error}
			</div>
		{/if}

		<!-- הצוות הנוכחי -->
		<div class="mb-8">
			<h2 class="mb-3 font-bold text-gray-200">
				הצוות הנוכחי
				<span class="mr-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white"
					>{data.admins.length}</span
				>
			</h2>
			{#if data.admins.length === 0}
				<p class="rounded-2xl border border-dashed border-white/15 py-10 text-center text-gray-500">
					אין עדיין אדמינים ממונים
				</p>
			{:else}
				<div class="space-y-2">
					{#each data.admins as u (u.id)}
						{@const [lbl, cls] = roleHe(u.app_role)}
						<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
							<div class="flex flex-wrap items-center gap-3">
								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-center gap-2">
										<span class="font-bold text-white">{u.name || u.email}</span>
										<span class="rounded-full border px-2 py-0.5 text-[11px] font-bold {cls}">{lbl}</span>
										{#if u.email?.toLowerCase() === OWNER}
											<span class="text-[11px] text-gray-500">(בעל האתר)</span>
										{/if}
									</div>
									<p class="mt-0.5 truncate text-xs text-gray-500" dir="ltr">
										{u.email} · #{u.id}{u.created_at ? ' · ' + fmtDate(u.created_at) : ''}
									</p>
								</div>
								{#if !isProtected(u)}
									<div class="flex flex-shrink-0 flex-wrap items-center gap-2">
										<!-- שינוי תפקיד -->
										<form
											method="POST"
											action="?/setRole"
											use:enhance={submitFn(u.id + 'role')}
											class="flex items-center gap-2"
										>
											<input type="hidden" name="userId" value={u.id} />
											<select
												name="role"
												value={u.app_role}
												class="rounded-lg border border-white/20 bg-[#1e293b] px-2 py-1.5 text-xs text-white focus:outline-none"
											>
												<option value="super_admin">סופר-אדמין</option>
												<option value="ref_admin">אדמין המשאלים</option>
											</select>
											<button
												disabled={busy === u.id + 'role'}
												class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-40"
											>
												{busy === u.id + 'role' ? '…' : 'עדכן תפקיד'}
											</button>
										</form>
										<!-- הסרה -->
										<form
											method="POST"
											action="?/setRole"
											use:enhance={({ cancel }) => {
												if (!confirm(`להסיר את ${u.name || u.email} מתפקיד ניהולי?`)) {
													cancel();
													return;
												}
												busy = u.id + 'rm';
												return async ({ update }) => {
													await update({ reset: false });
													busy = '';
												};
											}}
										>
											<input type="hidden" name="userId" value={u.id} />
											<input type="hidden" name="role" value="user" />
											<button
												disabled={busy === u.id + 'rm'}
												class="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
											>
												{busy === u.id + 'rm' ? '…' : 'הסר'}
											</button>
										</form>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- מינוי אדמין חדש -->
		<div>
			<h2 class="mb-3 font-bold text-gray-200">מינוי אדמין חדש</h2>
			<form method="GET" class="mb-4 flex gap-2">
				<input
					type="search"
					name="q"
					bind:value={q}
					oninput={onSearchInput}
					placeholder="חיפוש לפי שם / מייל / טלפון (לפחות 2 תווים)…"
					class="w-full max-w-md rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none"
				/>
				<button
					class="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
				>
					🔎 חפש
				</button>
			</form>

			{#if searching}
				<p class="mb-4 text-sm text-gray-400">🔍 מחפש בין המשתמשים הרשומים…</p>
			{/if}

			{#if activeQ.length >= 2}
				{#if searchResults.length === 0}
					{#if !searching}
						<p
							class="rounded-2xl border border-dashed border-white/15 py-10 text-center text-gray-500"
						>
							לא נמצא משתמש רשום התואם ל"{activeQ}"
						</p>
					{/if}
				{:else}
					<div class="space-y-2">
						{#each searchResults as u (u.id)}
							<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
								<div class="flex flex-wrap items-center gap-3">
									<div class="min-w-0 flex-1">
										<span class="font-bold text-white">{u.name || u.email}</span>
										<p class="mt-0.5 truncate text-xs text-gray-500" dir="ltr">
											{u.email} · #{u.id}{u.registered_site ? ' · ' + u.registered_site : ''}
										</p>
									</div>
									{#if foreignRole(u)}
										<span
											class="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold text-gray-400"
											title="app_role: {u.app_role}"
										>
											תפקיד באתר אחר — מנוהל משם
										</span>
									{:else}
										<form
											method="POST"
											action="?/setRole"
											use:enhance={submitFn(u.id + 'appoint')}
											class="flex flex-shrink-0 items-center gap-2"
										>
											<input type="hidden" name="userId" value={u.id} />
											<select
												name="role"
												class="rounded-lg border border-white/20 bg-[#1e293b] px-2 py-1.5 text-xs text-white focus:outline-none"
											>
												<option value="ref_admin">אדמין המשאלים</option>
												<option value="super_admin">סופר-אדמין</option>
											</select>
											<button
												disabled={busy === u.id + 'appoint'}
												class="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-40"
											>
												{busy === u.id + 'appoint' ? '…' : '✚ מנה'}
											</button>
										</form>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{:else}
				<p class="text-sm text-gray-500">
					חפשו משתמש קיים כדי למנות אותו. משתמש חייב להירשם לאחד מאתרי הרשת פעם אחת לפני
					שאפשר למנות אותו.
				</p>
			{/if}
		</div>
	{/if}
</section>
