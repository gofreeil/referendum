import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('he', () => Promise.resolve({
    welcome: "משאלי העם",
    app_description: "הקול שלך נספר – דמוקרטיה ישירה לכל אזרח",
    about: "אודות",
    back_home: "חזרה לדף הבית",
    connected: "מחוברים",
    contact_us: "צור קשר",
    all_rights_reserved: "כל הזכויות שמורות",
}));

register('en', () => Promise.resolve({
    welcome: "People's Referendum",
    app_description: "Your voice counts – direct democracy for every citizen",
    about: "About",
    back_home: "Back to Home",
    connected: "Connected",
    contact_us: "Contact Us",
    all_rights_reserved: "All rights reserved",
}));

register('ru', () => Promise.resolve({
    welcome: "Народный референдум",
    app_description: "Ваш голос важен – прямая демократия для каждого",
    about: "О проекте",
    back_home: "Вернуться домой",
    connected: "Подключено",
    contact_us: "Связаться с нами",
    all_rights_reserved: "Все права защищены",
}));

init({
    fallbackLocale: 'he',
    initialLocale: (typeof window !== 'undefined' && localStorage.getItem('lang')) || getLocaleFromNavigator() || 'he',
});
