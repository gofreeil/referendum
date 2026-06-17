// ============================================================
// adsData.ts - נתוני פרסומות משותפים לנייד ודסקטופ
// ============================================================

export interface Ad {
    title: string;
    summary: string;
    url: string;
    color: string;
    image?: string;
    bgStyle?: string;
    hoverTitle?: string;
    hoverText?: string;
    footerText?: string;
    extraClass?: string;
    comingSoon?: boolean;
    imageStyle?: string;
    imageContain?: boolean;
}

export const ads: Ad[] = [
    {
        title: 'בתי הפיוס',
        summary: 'יש לך סיכסוך? לחץ לפתרון',
        url: 'https://chachmim.vercel.app/',
        color: 'from-orange-600 to-red-600',
        image: '/images/bati-hapius.png',
        hoverTitle: 'בתי הפיוס',
        hoverText: 'מתנדבים לתת לך עזרה מלאה בדין / פיוס בכל סיכסוך',
        footerText: 'יש לך סיכסוך? לחץ לפתרון',
    },
    {
        title: 'הגמ"ח הארצי',
        summary: 'כל הגמחים תחת קורת גג אחת',
        url: 'https://national-gemach.vercel.app/',
        color: 'from-pink-600 via-fuchsia-600 to-purple-700',
        image: '/images/gemach-harzi.png',
        hoverTitle: 'הגמ"ח הארצי',
        hoverText: 'מצא כל גמח בקלות!',
        footerText: 'לאתר הגמ"ח הארצי',
    },
    {
        title: 'ועדי שכונות',
        summary: 'הצטרף לוועד השכונה שלך',
        url: 'https://neighborhoods-il.vercel.app/',
        color: 'from-blue-600 to-cyan-600',
        image: '/images/news/vaadei-shchunot.png',
        hoverTitle: 'ועדי שכונות',
        hoverText: 'מהפכת משילות העם על המוסדות',
        footerText: 'הכר והשתתף במהפכת משילות העם על מוסדותיו',
    },
    {
        title: 'מבקר רשויות המדינה',
        summary: 'מבקרים את הרשויות',
        url: 'https://criticism.vercel.app/',
        color: 'from-blue-700 to-indigo-700',
        image: '/images/mevaker-rashuyot.png',
        hoverTitle: 'מבקר רשויות המדינה',
        hoverText: 'מבקרים את הרשויות, ממצים את זכות התושב',
        footerText: 'מבקרים את הרשויות, ממצים את זכות התושב',
        imageStyle: 'height: 120px',
    },
    {
        title: 'דירוג ציבורי',
        summary: 'העם מדרג את הרשויות',
        url: 'https://public-rating-il.vercel.app/',
        color: 'from-indigo-600 to-blue-600',
        image: '/images/public-rating.jpeg',
        hoverTitle: 'דירוג ציבורי',
        hoverText: 'העם מדרג את הרשויות ועובדי הציבור',
        footerText: 'העם מדרג את הרשויות ועובדי הציבור',
        imageStyle: 'height: 200px',
    },
    {
        title: 'קבוצת רכישה',
        summary: 'הוזל את ההוצאות החודשיות',
        url: 'https://purchasing-groups.vercel.app/',
        color: 'from-green-800 to-emerald-900',
        image: '/images/whatsapp_cta.png',
        hoverTitle: 'קבוצת רכישה',
        hoverText: 'הוזל את ההוצאות שלך',
        footerText: 'הצטרף לקבוצת הרכישה שלנו והוזל מיד את ההוצאות!',
    },
    {
        title: 'מועדון המשקיעים החברתי',
        summary: 'התחבר עם קבוצת המשקיעים',
        url: 'https://www.melecshop.com/page/free',
        color: 'from-amber-600 to-orange-600',
        image: '/images/partners/investments.png',
        hoverTitle: 'מועדון המשקיעים החברתי',
        hoverText: 'התחבר עם קבוצת המשקיעים שלנו',
        footerText: 'התחבר עם קבוצת המשקיעים שלנו',
    },
    {
        title: 'בעלי מקצוע כשירים',
        summary: 'מחפש בעל מקצוע איכותי?',
        url: 'https://index-chi-sage.vercel.app/',
        color: 'from-yellow-500 to-orange-500',
        image: '/images/professionals.png',
        hoverTitle: 'בעלי מקצוע כשירים',
        hoverText: 'חתמו על תנאי הקהילה ונותנים לנו הנחות והטבות יחודיות',
        footerText: 'מחפש בעל מקצוע איכותי באזורך?',
    },
    {
        title: 'קהילה בשכונה',
        summary: 'כל יתרונות השכונה תחת קורת גג אחת',
        url: 'https://my-new-project.vercel.app/',
        color: 'from-blue-600 to-purple-700',
        image: '/images/community-neighborhood.png',
        hoverTitle: 'קהילה בשכונה',
        hoverText: 'כל יתרונות השכונה תחת קורת גג אחת',
        footerText: 'תהנה מכל היתרונות של השכונה שלך',
        extraClass: 'ring-1 ring-purple-500/40',
    },
    {
        title: 'החנות החברתית',
        summary: 'כנסו לחנות לחיים טובים יותר',
        url: 'https://heirut-shop.vercel.app/',
        color: 'from-emerald-600 to-teal-700',
        image: '/images/freedom-store.png',
        hoverTitle: 'החנות החברתית',
        hoverText: 'מוצרים נבחרים לבריאות, חקלאות, טכנולוגיה ועוד',
        footerText: 'לחנות שלנו',
    },
];
