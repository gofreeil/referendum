<script lang="ts">
    import { t, locale } from 'svelte-i18n';
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';

    let languages = [
        { name: "עברית", code: "he", flag: "il" },
        { name: "English", code: "en", flag: "us" },
        { name: "русский", code: "ru", flag: "ru" },
    ];

    let showLangDropdown = $state(false);
    let onlineUsers = $state(1);

    function changeLang(language: { name: string; code: string }) {
        locale.set(language.code);
        try { localStorage.setItem('lang', language.code); } catch {}
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".lang-dropdown-container")) {
            showLangDropdown = false;
        }
    }

    function handleLangKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            showLangDropdown = false;
            return;
        }
        if (event.key === 'ArrowDown' && !showLangDropdown) {
            event.preventDefault();
            showLangDropdown = true;
            setTimeout(() => {
                const container = (event.target as HTMLElement).closest('.lang-dropdown-container');
                const firstOption = container?.querySelector('[role="option"]') as HTMLElement;
                firstOption?.focus();
            }, 0);
            return;
        }
        if (!showLangDropdown) return;
        const target = event.target as HTMLElement;
        const container = target.closest('.lang-dropdown-container');
        if (!container) return;
        const options = Array.from(container.querySelectorAll('[role="option"]')) as HTMLElement[];
        if (options.length === 0) return;
        const currentIndex = options.indexOf(target);
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            options[currentIndex < options.length - 1 ? currentIndex + 1 : 0].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            options[currentIndex > 0 ? currentIndex - 1 : options.length - 1].focus();
        } else if (event.key === 'Home') {
            event.preventDefault();
            options[0].focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            options[options.length - 1].focus();
        }
    }

    onMount(() => {
        try {
            const saved = localStorage.getItem('lang');
            if (saved) locale.set(saved);
        } catch {}

        // Seed a random counter — matches the look of the main community site
        onlineUsers = Math.floor(Math.random() * 20) + 3;
        const usersInterval = setInterval(() => {
            onlineUsers = Math.floor(Math.random() * 20) + 3;
        }, 30000);

        document.addEventListener("click", handleClickOutside);
        return () => {
            clearInterval(usersInterval);
            document.removeEventListener("click", handleClickOutside);
        };
    });

    // tFn: תרגום reactive — $t אסור ב-Svelte 5
    let _loc = $state(get(locale));
    $effect(() => locale.subscribe(l => (_loc = l)));
    const tFn = (k: string) => { void _loc; return get(t)(k); };
</script>

<header
    class="sticky top-0 z-50 border-b-2 md:border-b-4 border-blue-600 shadow-lg backdrop-blur-lg"
    style="background: linear-gradient(to bottom, rgba(17, 24, 39, 0.88) 0%, rgba(17, 24, 39, 0.88) 66%, rgba(17, 24, 39, 0.1) 100%);"
>
    <div class="relative mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <!-- Mobile Header Area -->
        <div class="md:hidden h-[80px] relative">
                <div class="flex items-center justify-between h-full px-1 absolute inset-0">
                    <a
                        href="/"
                        class="flex items-center gap-2.5 flex-1 min-w-0"
                    >
                        <div class="relative">
                            <div class="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                    src="/images/community-logo1.png"
                                    alt=""
                                    class="w-full h-full object-cover scale-[1.3]"
                                />
                            </div>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h1
                                class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-black text-transparent leading-tight truncate"
                            >
                                {tFn("welcome")}
                            </h1>
                            <p class="text-xs text-gray-400 leading-tight truncate">
                                {tFn("app_description")}
                            </p>
                        </div>
                    </a>

                    <div class="flex items-center gap-2">
                        <!-- כפתור דגל שפה - מובייל -->
                        <div class="relative lang-dropdown-container">
                            <button
                                onclick={() => (showLangDropdown = !showLangDropdown)}
                                onkeydown={handleLangKeydown}
                                class="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                                aria-label="בחר שפה"
                                aria-haspopup="listbox"
                                aria-expanded={showLangDropdown}
                            >
                                <span
                                    class="fi fi-{languages.find((l) => l.code === $locale || $locale?.startsWith(l.code))?.flag || 'il'}"
                                    style="font-size: 1.4rem;"
                                    aria-hidden="true"
                                ></span>
                            </button>
                            {#if showLangDropdown}
                                <div
                                    class="absolute left-0 z-[160] mt-2 w-36 rounded-lg bg-[#0f172a] border border-white/10 shadow-xl"
                                    role="listbox"
                                    aria-label="בחר שפה"
                                >
                                    {#each languages as langOption}
                                        <button
                                            class="flex w-full items-center gap-3 px-3 py-2 text-right text-white hover:bg-white/10 transition-colors"
                                            onclick={() => { changeLang(langOption); showLangDropdown = false; }}
                                            onkeydown={handleLangKeydown}
                                            role="option"
                                            aria-selected={$locale === langOption.code || $locale?.startsWith(langOption.code)}
                                        >
                                            <span class="fi fi-{langOption.flag}" style="font-size: 1.2rem;" aria-hidden="true"></span>
                                            <span class="text-sm">{langOption.name}</span>
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
        </div>

        <!-- Desktop Header - Full Layout -->
        <div class="hidden md:flex flex-col items-center pt-0 pb-0.5 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center space-x-4">
                <div class="relative group">
                    <a
                        href="/"
                        class="flex h-28 w-28 animate-pulse-slow items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        <div class="h-16 w-16 rounded-full overflow-hidden">
                            <img
                                src="/images/community-logo1.png"
                                alt=""
                                class="w-full h-full object-cover scale-[1.3]"
                            />
                        </div>
                    </a>
                    <div
                        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-[9999]"
                    >
                        <div
                            class="bg-gray-900 text-white text-sm rounded-lg px-4 py-2 shadow-xl whitespace-nowrap"
                        >
                            {tFn("back_home")}
                            <div
                                class="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-900"
                            ></div>
                        </div>
                    </div>
                </div>
                <a href="/" class="group">
                    <h1
                        class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent group-hover:opacity-80 transition-opacity"
                    >
                        {tFn("welcome")}
                    </h1>
                    <p class="text-lg text-gray-100 font-extrabold group-hover:opacity-80 transition-opacity">{tFn("app_description")}</p>
                </a>
            </div>
            <div class="flex items-center gap-2">
                <!-- כפתור אודות -->
                <a
                    href="https://my-new-project.vercel.app/about/revenue"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="relative flex items-center rounded-lg px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-105 hover:tracking-wide"
                    style="background:linear-gradient(135deg,#4f46e5,#7c3aed); box-shadow:0 4px 15px rgba(124,58,237,0.4);"
                >
                    {tFn("about")}
                </a>
                <!-- Language Dropdown -->
                <div class="lang-dropdown-container relative">
                    <button
                        class="flex items-center rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm text-white transition-colors"
                        onclick={() => (showLangDropdown = !showLangDropdown)}
                        onkeydown={handleLangKeydown}
                        aria-label="בחר שפה"
                        aria-haspopup="listbox"
                        aria-expanded={showLangDropdown}
                    >
                        <span
                            class="fi fi-{languages.find(
                                (l) => l.code === $locale || $locale?.startsWith(l.code),
                            )?.flag || 'il'} ml-2"
                            style="font-size: 1.5rem; margin-left: 0.75rem;"
                            aria-hidden="true"
                        ></span>
                        {languages.find((l) => l.code === $locale || $locale?.startsWith(l.code))?.name ||
                            'עברית'}
                        <svg
                            class="mr-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {#if showLangDropdown}
                        <div
                            class="absolute right-0 z-[160] mt-2 w-44 rounded-lg bg-[#0f172a] border border-white/10 shadow-xl"
                            role="listbox"
                            aria-label="בחר שפה"
                        >
                            {#each languages as langOption}
                                <button
                                    class="flex w-full items-center gap-4 px-4 py-2 text-right text-white hover:bg-white/10 transition-colors"
                                    onclick={() => {
                                        changeLang(langOption);
                                        showLangDropdown = false;
                                    }}
                                    onkeydown={handleLangKeydown}
                                    role="option"
                                    aria-selected={$locale === langOption.code || $locale?.startsWith(langOption.code)}
                                >
                                    <span class="text-sm">{langOption.name}</span>
                                    <span
                                        class="fi fi-{langOption.flag}"
                                        style="font-size: 1.5rem;"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
            <div class="flex items-center gap-4">
                <!-- מספר גולשים -->
                <div
                    class="flex items-center gap-2 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-500/30 online-counter"
                    aria-label="{onlineUsers} משתמשים מחוברים כעת"
                    role="status"
                >
                    <span class="text-green-400 text-xl" aria-hidden="true">●</span>
                    <span class="text-white text-sm font-bold" aria-hidden="true">{onlineUsers}</span>
                    <span class="text-gray-300 text-sm" aria-hidden="true">{tFn("connected")}</span>
                </div>
            </div>
        </div>
    </div>
</header>

<style>
    @keyframes pulse-slow {
        0%, 100% { opacity: 1; }
        36% { opacity: 0.75; }
    }

    :global(.animate-pulse-slow) {
        animation: pulse-slow 11s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes blink-every-2min {
        0%, 0.83%, 100% { opacity: 1; }
        0.415% { opacity: 0.3; }
    }

    :global(.online-counter) {
        animation: blink-every-2min 120s ease-in-out infinite;
    }
</style>
