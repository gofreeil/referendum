<script lang="ts">
    import { page } from '$app/stores';
    import { getIssue, getSideColor, getSideLabel } from '$lib/referendumData';

    let slug = $derived($page.params.slug);
    let issue = $derived(getIssue(slug));

    let selectedVote = $state<string | null>(null);
    let activeTab = $state<'sides' | 'experts' | 'results'>('sides');

    function fmt(n: number) {
        return n.toLocaleString('he-IL');
    }

    function vote(sideId: string) {
        selectedVote = sideId;
    }
</script>

{#if !issue}
    <div class="text-center py-20">
        <h1 class="text-3xl text-white">סוגיה לא נמצאה</h1>
        <a href="/" class="text-blue-400 mt-4 inline-block">חזרה לסוגיות →</a>
    </div>
{:else}
    <a href="/" class="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 mb-4 text-sm">
        <span>→</span> חזרה לכל הסוגיות
    </a>

    <!-- Issue Header -->
    <section class="rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 p-6 md:p-8 mb-6">
        <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 px-2 py-1 rounded">
                {issue.category}
            </span>
            <span class="text-xs px-2 py-1 rounded bg-green-500/10 text-green-300 border border-green-400/30">
                {issue.status}
            </span>
            <span class="text-xs text-gray-400">📅 עד {issue.deadline}</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-white mb-3">{issue.title}</h1>
        <p class="text-lg text-gray-300 mb-4">{issue.description}</p>
        <div class="rounded-xl bg-blue-500/5 border border-blue-400/20 p-4">
            <div class="text-xs font-bold uppercase text-blue-300 mb-1">רקע</div>
            <p class="text-sm text-gray-300">{issue.background}</p>
        </div>
    </section>

    <!-- Quick Stats -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl font-black text-blue-300">{fmt(issue.totalVotes)}</div>
            <div class="text-xs text-gray-400">משתתפים</div>
        </div>
        <div class="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl font-black text-purple-300">{issue.teams.length}</div>
            <div class="text-xs text-gray-400">צוותי מומחים</div>
        </div>
        <div class="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl font-black text-pink-300">{issue.experts.length}</div>
            <div class="text-xs text-gray-400">מומחים</div>
        </div>
        <div class="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl font-black text-emerald-300">{issue.sides.length}</div>
            <div class="text-xs text-gray-400">צדדים</div>
        </div>
    </section>

    <!-- Tabs -->
    <div class="flex gap-2 mb-5 border-b border-white/10 overflow-x-auto">
        <button
            onclick={() => (activeTab = 'sides')}
            class="px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors {activeTab === 'sides' ? 'text-blue-300 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}"
        >
            ⚖️ ניתוח צדדים
        </button>
        <button
            onclick={() => (activeTab = 'experts')}
            class="px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors {activeTab === 'experts' ? 'text-blue-300 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}"
        >
            🎓 צוותי מומחים וניקוד
        </button>
        <button
            onclick={() => (activeTab = 'results')}
            class="px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors {activeTab === 'results' ? 'text-blue-300 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}"
        >
            🗳️ הצבעה ותוצאות
        </button>
    </div>

    <!-- Sides Analysis -->
    {#if activeTab === 'sides'}
        <section class="space-y-4">
            <h2 class="text-2xl font-black text-white mb-3">ניתוח הצדדים</h2>
            <div class="grid grid-cols-1 lg:grid-cols-{Math.min(issue.sides.length, 3)} gap-4">
                {#each issue.sides as side}
                    <div
                        class="rounded-2xl border p-5 transition-all hover:scale-[1.01]"
                        style="background:linear-gradient(135deg, {side.color}15, {side.color}05); border-color:{side.color}55"
                    >
                        <div class="flex items-center gap-2 mb-3">
                            <span
                                class="text-sm font-black px-3 py-1 rounded-full"
                                style="background:{side.color}; color:#0f172a"
                            >
                                {side.label}
                            </span>
                        </div>
                        <p class="text-base font-bold text-white mb-3">{side.summary}</p>
                        <div class="text-xs uppercase font-bold text-gray-400 mb-2">טיעונים</div>
                        <ul class="space-y-2">
                            {#each side.arguments as arg}
                                <li class="flex gap-2 text-sm text-gray-200">
                                    <span style="color:{side.color}" class="font-black">✓</span>
                                    <span>{arg}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Experts and Teams -->
    {#if activeTab === 'experts'}
        <section class="space-y-6">
            <div>
                <h2 class="text-2xl font-black text-white mb-1">צוותי מומחים</h2>
                <p class="text-sm text-gray-400 mb-4">צוותים אינטרדיסציפלינריים שניתחו את הסוגיה</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {#each issue.teams as team}
                        {@const sideColor = getSideColor(issue, team.sideId)}
                        <div class="rounded-xl bg-white/5 border border-white/10 p-4">
                            <div class="flex items-start justify-between gap-3 mb-2">
                                <div>
                                    <div class="font-bold text-white">{team.name}</div>
                                    <div class="text-xs text-gray-400">{team.field}</div>
                                </div>
                                <span
                                    class="text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap"
                                    style="background:{sideColor}22; color:{sideColor}; border:1px solid {sideColor}55"
                                >
                                    תומך ב{getSideLabel(issue, team.sideId)}
                                </span>
                            </div>
                            <p class="text-sm text-gray-300 mb-3">{team.description}</p>
                            <div class="flex items-center justify-between text-xs text-gray-400">
                                <span>👥 {team.members} חברים</span>
                                <span>בראשות: <span class="text-white font-bold">{team.leadExpert}</span></span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div>
                <h2 class="text-2xl font-black text-white mb-1">ניקוד מומחים</h2>
                <p class="text-sm text-gray-400 mb-4">ציון מקצועי שניתן על ידי כל מומחה בהתבסס על ניתוח עצמאי</p>
                <div class="space-y-3">
                    {#each issue.experts as expert}
                        {@const sideColor = getSideColor(issue, expert.sideId)}
                        <div class="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-full flex items-center justify-center font-black text-white text-lg flex-shrink-0"
                                style="background:linear-gradient(135deg, {sideColor}, {sideColor}aa)"
                            >
                                {expert.avatar}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="font-bold text-white">{expert.name}</span>
                                    <span
                                        class="text-xs px-2 py-0.5 rounded-full"
                                        style="background:{sideColor}22; color:{sideColor}; border:1px solid {sideColor}55"
                                    >
                                        {getSideLabel(issue, expert.sideId)}
                                    </span>
                                </div>
                                <div class="text-xs text-gray-400">{expert.title} · {expert.affiliation}</div>
                                <div class="text-sm text-gray-300 mt-1 italic">"{expert.reasoning}"</div>
                            </div>
                            <div class="text-center flex-shrink-0">
                                <div class="text-2xl font-black text-white">{expert.score}</div>
                                <div class="text-[10px] uppercase text-gray-400">ביטחון</div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-purple-600/15 to-blue-600/10 border border-white/10 p-5">
                <h3 class="text-lg font-black text-white mb-3">קונצנזוס מומחים</h3>
                <div class="space-y-2">
                    {#each issue.expertConsensus as c}
                        {@const side = issue.sides.find((s) => s.id === c.sideId)}
                        <div>
                            <div class="flex items-center justify-between text-sm mb-1">
                                <span class="text-white font-bold">{side?.label}</span>
                                <span class="font-black" style="color:{side?.color}">{c.weight}%</span>
                            </div>
                            <div class="h-2 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    class="h-full transition-all"
                                    style="width:{c.weight}%; background:{side?.color}"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>
    {/if}

    <!-- Results / Voting -->
    {#if activeTab === 'results'}
        <section class="space-y-5">
            <div class="rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 p-6">
                <div class="text-xs uppercase font-bold text-blue-300 mb-2">שאלת המשאל</div>
                <h2 class="text-xl md:text-2xl font-black text-white mb-5">{issue.pollQuestion}</h2>

                {#if !selectedVote}
                    <div class="space-y-2">
                        {#each issue.pollOptions as opt}
                            {@const side = issue.sides.find((s) => s.id === opt.sideId)}
                            <button
                                onclick={() => vote(opt.sideId)}
                                class="w-full text-right rounded-xl border-2 px-4 py-3 transition-all hover:scale-[1.01]"
                                style="background:{side?.color}10; border-color:{side?.color}55"
                            >
                                <span class="font-bold text-white">{opt.label}</span>
                            </button>
                        {/each}
                    </div>
                {:else}
                    <div class="rounded-xl bg-green-500/10 border border-green-400/30 p-3 mb-4 text-sm text-green-200">
                        ✓ הצבעתך נרשמה. תודה על השתתפותך!
                    </div>
                {/if}
            </div>

            <div class="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-black text-white">תוצאות בזמן אמת</h3>
                    <span class="text-xs text-gray-400">{fmt(issue.totalVotes)} הצביעו</span>
                </div>

                <div class="space-y-4">
                    {#each issue.pollOptions as opt}
                        {@const side = issue.sides.find((s) => s.id === opt.sideId)}
                        {@const pct = Math.round((opt.votes / issue.totalVotes) * 100)}
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="h-3 w-3 rounded-full"
                                        style="background:{side?.color}"
                                    ></span>
                                    <span class="font-bold text-white text-sm">{opt.label}</span>
                                    {#if selectedVote === opt.sideId}
                                        <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">✓ הקול שלך</span>
                                    {/if}
                                </div>
                                <div class="text-left">
                                    <span class="text-lg font-black" style="color:{side?.color}">{pct}%</span>
                                    <span class="text-xs text-gray-400 mr-2">{fmt(opt.votes)}</span>
                                </div>
                            </div>
                            <div class="h-3 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    class="h-full transition-all"
                                    style="width:{pct}%; background:linear-gradient(90deg, {side?.color}, {side?.color}aa)"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/15 border border-white/10 p-5">
                <h3 class="text-lg font-black text-white mb-2">השוואה: ציבור מול מומחים</h3>
                <p class="text-xs text-gray-300 mb-4">מה חושב הציבור, ומה מסכמים המומחים</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div class="text-xs uppercase font-bold text-blue-300 mb-2">דעת הציבור</div>
                        <div class="space-y-2">
                            {#each issue.pollOptions as opt}
                                {@const side = issue.sides.find((s) => s.id === opt.sideId)}
                                {@const pct = Math.round((opt.votes / issue.totalVotes) * 100)}
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-white">{side?.label}</span>
                                    <span class="font-black" style="color:{side?.color}">{pct}%</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div>
                        <div class="text-xs uppercase font-bold text-purple-300 mb-2">דעת המומחים</div>
                        <div class="space-y-2">
                            {#each issue.expertConsensus as c}
                                {@const side = issue.sides.find((s) => s.id === c.sideId)}
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-white">{side?.label}</span>
                                    <span class="font-black" style="color:{side?.color}">{c.weight}%</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    {/if}
{/if}
