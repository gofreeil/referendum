<script lang="ts">
    import { issues } from '$lib/referendumData';

    const totalParticipants = issues.reduce((s, i) => s + i.totalVotes, 0);
    const totalExperts = issues.reduce((s, i) => s + i.experts.length, 0);
    const totalTeams = issues.reduce((s, i) => s + i.teams.length, 0);

    function fmt(n: number) {
        return n.toLocaleString('he-IL');
    }
</script>

<section class="flex flex-col items-center text-center gap-6 py-10 px-4">
    <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/30 px-4 py-1.5 text-sm text-blue-200">
        <span class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
        פלטפורמת משאלי עם – דמוקרטיה ישירה לכל אזרח
    </div>
    <h1 class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-5xl md:text-7xl font-black text-transparent leading-tight">
        משאלי העם
    </h1>
    <p class="max-w-2xl text-lg text-gray-300">
        סוגיות אקטואליות, צוותי מומחים, ניתוח צדדים מעמיק וניקוד מקצועי – ואתם מצביעים.
    </p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-4">
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div class="text-3xl font-black text-blue-300">{issues.length}</div>
            <div class="text-sm text-gray-400">סוגיות פעילות</div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div class="text-3xl font-black text-purple-300">{totalTeams}</div>
            <div class="text-sm text-gray-400">צוותי מומחים</div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div class="text-3xl font-black text-pink-300">{totalExperts}</div>
            <div class="text-sm text-gray-400">מומחים</div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div class="text-3xl font-black text-emerald-300">{fmt(totalParticipants)}</div>
            <div class="text-sm text-gray-400">משתתפים</div>
        </div>
    </div>
</section>

<section class="px-4 mt-2 md:mt-6">
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-2xl md:text-3xl font-black text-white">סוגיות לדיון</h2>
        <span class="text-sm text-gray-400">{issues.length} סוגיות אקטואליות</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        {#each issues as issue}
            {@const leadingOption = [...issue.pollOptions].sort((a, b) => b.votes - a.votes)[0]}
            {@const leadingPct = Math.round((leadingOption.votes / issue.totalVotes) * 100)}
            <a
                href="/issue/{issue.slug}"
                class="group block rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 hover:border-blue-400/50 p-5 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10"
            >
                <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 px-2 py-1 rounded">
                        {issue.category}
                    </span>
                    <span class="text-xs px-2 py-1 rounded bg-green-500/10 text-green-300 border border-green-400/30">
                        {issue.status}
                    </span>
                </div>

                <h3 class="text-xl md:text-2xl font-black text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {issue.title}
                </h3>
                <p class="text-sm text-gray-400 mb-4 line-clamp-2">
                    {issue.description}
                </p>

                <div class="flex flex-wrap gap-1.5 mb-4">
                    {#each issue.sides as side}
                        <span
                            class="text-xs px-2 py-1 rounded-full border"
                            style="background:{side.color}22; border-color:{side.color}66; color:{side.color}"
                        >
                            {side.label}
                        </span>
                    {/each}
                </div>

                <div class="flex h-2 rounded-full overflow-hidden bg-white/5 mb-3">
                    {#each issue.pollOptions as opt}
                        {@const side = issue.sides.find((s) => s.id === opt.sideId)}
                        <div
                            style="width:{(opt.votes / issue.totalVotes) * 100}%; background:{side?.color || '#64748b'}"
                        ></div>
                    {/each}
                </div>

                <div class="flex items-center justify-between text-xs">
                    <div class="flex gap-3 text-gray-400">
                        <span>👥 {issue.teams.length} צוותים</span>
                        <span>🎓 {issue.experts.length} מומחים</span>
                        <span>🗳️ {fmt(issue.totalVotes)}</span>
                    </div>
                    <span class="text-blue-300 font-bold">{leadingPct}% מובילים</span>
                </div>
            </a>
        {/each}
    </div>
</section>

<section class="px-4 mt-12 mb-8">
    <div class="rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-pink-600/20 border border-white/10 p-6 md:p-8">
        <h2 class="text-2xl md:text-3xl font-black text-white mb-3">איך זה עובד?</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
            <div>
                <div class="text-3xl mb-2">📌</div>
                <div class="font-bold text-white mb-1">1. בוחרים סוגיה</div>
                <div class="text-sm text-gray-400">סוגיות אקטואליות שדורשות הכרעה ציבורית</div>
            </div>
            <div>
                <div class="text-3xl mb-2">👨‍🔬</div>
                <div class="font-bold text-white mb-1">2. קוראים את המומחים</div>
                <div class="text-sm text-gray-400">צוותי מומחים מציגים את כל הצדדים</div>
            </div>
            <div>
                <div class="text-3xl mb-2">⚖️</div>
                <div class="font-bold text-white mb-1">3. רואים ניתוח</div>
                <div class="text-sm text-gray-400">השוואה הוגנת ושקופה בין הצדדים</div>
            </div>
            <div>
                <div class="text-3xl mb-2">🗳️</div>
                <div class="font-bold text-white mb-1">4. מצביעים</div>
                <div class="text-sm text-gray-400">קולכם נספר ומשפיע על סדר היום</div>
            </div>
        </div>
    </div>
</section>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
