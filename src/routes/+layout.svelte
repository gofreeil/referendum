<script lang="ts">
    import '../app.css';
    import 'flag-icons/css/flag-icons.min.css';
    import '$lib/i18n';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import AdsSidebar from '$lib/components/AdsSidebar.svelte';
    import RightAdBanner from '$lib/components/RightAdBanner.svelte';
    import MobileAdsDrawer from '$lib/components/MobileAdsDrawer.svelte';
    import AdInterstitial from '$lib/components/AdInterstitial.svelte';
    import WelcomeScreen from '$lib/components/WelcomeScreen.svelte';
    import { navigating } from '$app/state';

    let { children, data } = $props();
</script>

<svelte:head>
    <!-- כותרת גיבוי בלבד: כל דף ציבורי דורס אותה ב-<svelte:head> משלו -->
    <title>משאלי העם – הקול שלך נספר | יוצאים לחירות</title>
    <meta name="description" content="משאלי העם של תנועת יוצאים לחירות – הבע דעתך על הסוגיות האקטואליות שעל סדר היום הציבורי" />
    <link rel="icon" href="/images/referendum-logo.png" type="image/png" />
    <link rel="apple-touch-icon" href="/images/referendum-logo.png" />
    <meta property="og:title" content="משאלי העם – הקול שלך נספר | יוצאים לחירות" />
    <meta property="og:description" content="פלטפורמת משאלי עם: סוגיות, צוותי מומחים, ניתוח צדדים ותוצאות חיות" />
    <meta property="og:image" content="/images/referendum-logo.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="/images/referendum-logo.png" />
</svelte:head>

<a href="#main-content" class="skip-link">דלג לתוכן הראשי</a>

<!-- פס התקדמות בזמן ניווט: SvelteKit נשאר על הדף הקודם עד שהחדש מוכן, ובלי סימן כלשהו הלחיצה מרגישה כאילו לא קרה כלום. הפס נדלק מיידית עם הלחיצה — משוב תוך כדי הטעינה, גם במחיר הבהוב קצר בניווט מהיר. -->
{#if navigating.to}
    <div class="nav-progress" role="status" aria-label="טוען…"></div>
{/if}

<!-- מסך פתיחה אחרי הרשמה / זיהוי ראשון — גלובלי, מופעל ע"י ?welcome ב-URL -->
<WelcomeScreen />

<MobileAdsDrawer />

<div class="min-h-screen flex flex-col bg-[#0f172a]">
    <Header user={data.user} />

    <div class="layout-container flex-grow">
        <RightAdBanner />
        <main id="main-content" tabindex="-1" class="main-content">
            <div class="hero-banner">
                <div class="hero-banner-img-wrap">
                    <img src="/images/hero-banner.png" alt="כנסת ישראל, דגל המדינה ומאזני הצדק" />
                </div>
                <img class="hero-logo" src="/images/referendum-logo.png" alt="משאלי העם" />
            </div>
            {@render children()}
        </main>
        <AdsSidebar />
    </div>

    <Footer />
</div>

<!-- פרסומת-הביניים (נייד) — שכבה גלובלית; נפתחת רק דרך adGate -->
<AdInterstitial />

<style>
    /* פס ההתקדמות של הניווט */
    .nav-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        z-index: 100;
        transform-origin: left center;
        background: linear-gradient(90deg, #4f46e5, #7c3aed, #f5d57a);
        animation: nav-progress 8s cubic-bezier(0.15, 0.85, 0.25, 1) forwards;
    }
    :global(html[dir="rtl"]) .nav-progress {
        transform-origin: right center;
    }
    @keyframes nav-progress {
        0% { transform: scaleX(0.04); opacity: 1; }
        25% { transform: scaleX(0.55); }
        60% { transform: scaleX(0.82); }
        100% { transform: scaleX(0.97); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
        .nav-progress { animation-duration: 0s; transform: scaleX(1); opacity: 1; }
    }

    .layout-container {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem 1.5rem 0 1.5rem;
        width: 100%;
    }

    .main-content {
        flex: 1;
        min-width: 0;
    }

    .hero-banner {
        position: relative;
        width: 100%;
        margin-top: 37px;
        margin-bottom: 1.5rem;
    }
    .hero-banner-img-wrap {
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid rgba(96, 165, 250, 0.25);
    }
    .hero-banner-img-wrap > img {
        width: 100%;
        height: auto;
        display: block;
    }
    .hero-logo {
        position: absolute;
        top: 100%;
        right: 0.5rem;
        transform: translateY(-66.67%);
        width: clamp(110px, 18vw, 210px);
        height: auto;
        z-index: 2;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35));
    }

    @media (max-width: 1024px) {
        .layout-container {
            padding: 1rem;
            flex-direction: column;
        }
    }
</style>
