import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('he', () => Promise.resolve({
    welcome: "קהילה בשכונה",
    app_description: "כל יתרונות השכונה תחת קורת גג אחת",
    about: "אודות",
    back_home: "חזרה לדף הבית",
    connected: "מחוברים",
    contact_us: "צור קשר",
    all_rights_reserved: "כל הזכויות שמורות",
}));

register('en', () => Promise.resolve({
    welcome: "Neighborhood Community",
    app_description: "All neighborhood advantages under one roof",
    about: "About",
    back_home: "Back to Home",
    connected: "Connected",
    contact_us: "Contact Us",
    all_rights_reserved: "All rights reserved",
}));

register('ru', () => Promise.resolve({
    welcome: "Сообщество района",
    app_description: "Все преимущества района под одной крышей",
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
