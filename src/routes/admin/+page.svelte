<script lang="ts">
	let { data } = $props();

	const fmt = (n: number) => n.toLocaleString('he-IL');

	const statusCls = (s: string) =>
		s === 'פעיל'
			? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
			: s === 'בקרוב'
				? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
				: 'bg-gray-500/15 text-gray-400 border-gray-500/30';
</script>

<svelte:head>
	<title>פאנל ניהול — משאלי העם</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto max-w-5xl px-4 py-8" dir="rtl">
	<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="flex items-center gap-3 text-3xl font-black text-white">
				פאנל ניהול
				{#if data.superAdmin}
					<span
						class="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300"
					>
						👑 סופר-אדמין
					</span>
				{:else}
					<span
						class="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300"
					>
						🛡️ אדמין
					</span>
				{/if}
			</h1>
			<p class="mt-1 text-sm text-gray-400">מחובר: {data.user.name} · {data.user.email}</p>
		</div>
		<div class="flex flex-shrink-0 items-center gap-3">
			<a
				href="/admin/ads"
				class="rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20"
			>
				📢 ניהול פרסומות
			</a>
			{#if data.superAdmin}
				<a
					href="/admin/admins"
					class="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20"
				>
					👥 ניהול אדמינים
				</a>
			{/if}
			<a href="/" class="text-sm text-gray-400 hover:text-blue-300">← לאתר</a>
		</div>
	</div>

	<!-- תמונת מצב -->
	<div class="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
		<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
			<div class="text-3xl font-black text-blue-300">{data.stats.issues}</div>
			<div class="text-sm text-gray-400">סוגיות ({data.stats.active} פעילות)</div>
		</div>
		<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
			<div class="text-3xl font-black text-emerald-300">{fmt(data.stats.totalVotes)}</div>
			<div class="text-sm text-gray-400">הצבעות</div>
		</div>
		<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
			<div class="text-3xl font-black text-purple-300">{data.stats.teams}</div>
			<div class="text-sm text-gray-400">צוותי מומחים</div>
		</div>
		<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
			<div class="text-3xl font-black text-pink-300">{data.stats.experts}</div>
			<div class="text-sm text-gray-400">מומחים</div>
		</div>
	</div>

	<!-- הסוגיות -->
	<h2 class="mb-3 text-xl font-bold text-white">הסוגיות באתר</h2>
	<div class="space-y-2">
		{#each data.issues as issue (issue.slug)}
			<a
				href="/issue/{issue.slug}"
				class="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
			>
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<span class="font-bold text-white">{issue.title}</span>
						<span class="rounded-full border px-2 py-0.5 text-[11px] font-bold {statusCls(issue.status)}">
							{issue.status}
						</span>
					</div>
					<p class="mt-0.5 text-xs text-gray-400">
						{issue.category} · {fmt(issue.totalVotes)} הצבעות · עד {issue.deadline}
					</p>
				</div>
				<span class="text-sm text-gray-500">פתח ←</span>
			</a>
		{/each}
	</div>

	<p class="mt-6 text-sm text-gray-500">
		תוכן הסוגיות (צדדים, מומחים, סקרים) מנוהל כרגע בקוד האתר — עריכה דרך הפאנל תתווסף כשהתוכן
		יעבור למסד הנתונים.
	</p>
</section>
