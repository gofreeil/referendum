<script lang="ts">
    import '../app.css';
    import 'flag-icons/css/flag-icons.min.css';
    import '$lib/i18n';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import AdsSidebar from '$lib/components/AdsSidebar.svelte';
    import RightAdBanner from '$lib/components/RightAdBanner.svelte';
    import MobileAdsBanner from '$lib/components/MobileAdsBanner.svelte';

    let { children } = $props();
</script>

<svelte:head>
    <title>משאלי העם – הקול שלך נספר</title>
    <meta name="description" content="משאלי העם – הבע דעתך על הסוגיות האקטואליות שעל סדר היום הציבורי" />
    <link rel="icon" href="/images/referendum-logo.png" type="image/png" />
    <link rel="apple-touch-icon" href="/images/referendum-logo.png" />
    <meta property="og:title" content="משאלי העם – הקול שלך נספר" />
    <meta property="og:description" content="פלטפורמת משאלי עם: סוגיות, צוותי מומחים, ניתוח צדדים ותוצאות חיות" />
    <meta property="og:image" content="/images/referendum-logo.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="/images/referendum-logo.png" />
</svelte:head>

<a href="#main-content" class="skip-link">דלג לתוכן הראשי</a>
<MobileAdsBanner />

<div class="min-h-screen flex flex-col bg-[#0f172a]">
    <Header />

    <div class="hero-banner">
        <img src="/images/hero-banner.png" alt="כנסת ישראל, דגל המדינה ומאזני הצדק" />
        <div class="hero-banner-overlay"></div>
    </div>

    <div class="layout-container flex-grow">
        <RightAdBanner />
        <main id="main-content" tabindex="-1" class="main-content">
            {@render children()}
        </main>
        <AdsSidebar />
    </div>

    <Footer />
</div>

<style>
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
        max-height: 220px;
        overflow: hidden;
        border-bottom: 2px solid rgba(96, 165, 250, 0.3);
    }
    .hero-banner img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
    }
    .hero-banner-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0) 40%, rgba(15, 23, 42, 0.7) 100%);
        pointer-events: none;
    }

    @media (max-width: 768px) {
        .hero-banner {
            max-height: 140px;
        }
    }

    @media (max-width: 1024px) {
        .layout-container {
            padding: 1rem;
            flex-direction: column;
        }
    }
</style>
