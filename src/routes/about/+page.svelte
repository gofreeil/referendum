<script lang="ts">
    // דף אודותינו — פסקת פתיחה + אגף שאלות ותשובות.
    // השו"ת נבנה ממקור אמת אחד ($lib/aboutFaq) וגם מוזרק כסכמת FAQPage
    // (JSON-LD) כדי שמנועי חיפוש ומנועי AI יזהו מה מטרת האתר ולמי הוא מיועד.
    import { ABOUT_FAQ } from '$lib/aboutFaq';
    import { SITE_NAME, SITE_TAGLINE, PARENT_BRAND, canonical, faqSchema } from '$lib/seo';
    import JsonLd from '$lib/components/JsonLd.svelte';

    const description =
        'משאלי העם – אתר להבעת דעה על הסוגיות האקטואליות שעל סדר היום הציבורי: ניתוח צדדים, צוותי מומחים והצבעה ציבורית. מה זה, למי מיועד, איך מצביעים ומי עומד מאחורי האתר.';
</script>

<svelte:head>
    <title>אודותינו | {SITE_NAME} | {PARENT_BRAND}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical('/about')} />
    <meta property="og:title" content="אודותינו | {SITE_NAME} | {PARENT_BRAND}" />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical('/about')} />
</svelte:head>

<JsonLd schema={faqSchema(ABOUT_FAQ)} />

<div class="mx-auto max-w-3xl px-4 py-8 md:py-12" dir="rtl">
    <div class="rounded-3xl border border-[#2c3a55] bg-[#0f1626] shadow-2xl overflow-hidden">

        <!-- כותרת + פסקת פתיחה -->
        <div class="p-6 md:p-10 text-center">
            <div class="text-5xl mb-4">🗳️</div>
            <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                אודותינו
            </h1>
            <p class="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                {SITE_NAME} הוא אתר להבעת דעה על הסוגיות האקטואליות שעל סדר היום הציבורי.
                בכל סוגיה מוצגים הצדדים השונים, צוותי מומחים שמנתחים אותם והשוואה שקופה ביניהם – ואתם מצביעים.
                האתר חלק מרשת האתרים של התנועה החברתית "יוצאים לחירות", והשימוש בו חינם ופתוח לכולם.
                {SITE_TAGLINE}!
            </p>
        </div>

        <!-- שאלות ותשובות -->
        <div class="mx-8 md:mx-12 border-t border-[#2c3a55]"></div>
        <section id="faq" aria-labelledby="faq-title" class="p-6 md:p-8">
            <h2 id="faq-title" class="text-2xl font-black text-white mb-5">שאלות ותשובות</h2>
            <div class="space-y-3">
                {#each ABOUT_FAQ as item, i (item.q)}
                    <details
                        class="faq-item group rounded-2xl border border-white/10 bg-white/5 open:border-blue-400/40 open:bg-blue-500/5 transition-colors"
                        open={i < 2}
                    >
                        <summary class="cursor-pointer list-none flex items-start justify-between gap-3 px-4 py-3 text-base md:text-lg font-bold text-white hover:text-blue-200 transition-colors">
                            <span>{item.q}</span>
                            <span class="faq-chevron flex-shrink-0 text-blue-300 transition-transform" aria-hidden="true">▾</span>
                        </summary>
                        <p class="px-4 pb-4 text-sm md:text-base text-gray-200 leading-relaxed">{item.a}</p>
                    </details>
                {/each}
            </div>
        </section>

        <!-- קישורים -->
        <div class="mx-8 md:mx-12 border-t border-[#2c3a55]"></div>
        <div class="p-6 md:p-8 text-center">
            <a
                href="/"
                class="inline-block rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 font-black text-white shadow-xl transition hover:opacity-90 hover:scale-[1.02]"
            >
                לסוגיות ולהצבעה ←
            </a>
        </div>
    </div>
</div>

<style>
    /* מסתיר את משולש ברירת המחדל של <summary> — במקומו החץ שלנו */
    .faq-item summary::-webkit-details-marker {
        display: none;
    }
    .faq-item[open] .faq-chevron {
        transform: rotate(180deg);
    }
</style>
