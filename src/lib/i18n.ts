import { register, init } from 'svelte-i18n';

register('he', () => Promise.resolve({
    welcome: "משאלי העם",
    app_description: "הקול שלך נספר!",
    about: "אודות",
    back_home: "חזרה לדף הבית",
    connected: "מחוברים",
    contact_us: "צור קשר",
    all_rights_reserved: "כל הזכויות שמורות",
    b_mobile_edit_hint: "לחיצה על טקסט לעריכה, גרירה להזזה.",
    b_mobile_reset_pos: "אפס מיקומים",
}));

register('en', () => Promise.resolve({
    welcome: "People's Referendum",
    app_description: "Your voice counts!",
    about: "About",
    back_home: "Back to Home",
    connected: "Connected",
    contact_us: "Contact Us",
    all_rights_reserved: "All rights reserved",
    b_mobile_edit_hint: "Tap text to edit, drag to move.",
    b_mobile_reset_pos: "Reset positions",
}));

register('ru', () => Promise.resolve({
    welcome: "Народный референдум",
    app_description: "Ваш голос важен!",
    about: "О проекте",
    back_home: "Вернуться домой",
    connected: "Подключено",
    contact_us: "Связаться с нами",
    all_rights_reserved: "Все права защищены",
    b_mobile_edit_hint: "Нажмите на текст для правки, перетащите для перемещения.",
    b_mobile_reset_pos: "Сбросить позиции",
}));

init({
    fallbackLocale: 'he',
    // תמיד עברית כברירת מחדל — שפת המכשיר לא קובעת; רק בחירה ידנית שנשמרה
    initialLocale: (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'he',
});
