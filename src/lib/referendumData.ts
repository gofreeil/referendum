export type Side = {
    id: string;
    label: string;
    color: string;
    summary: string;
    arguments: string[];
};

export type Expert = {
    id: string;
    name: string;
    title: string;
    affiliation: string;
    avatar: string;
    sideId: string;
    score: number;
    reasoning: string;
};

export type Team = {
    id: string;
    name: string;
    field: string;
    members: number;
    leadExpert: string;
    description: string;
    sideId: string;
};

export type PollOption = {
    sideId: string;
    label: string;
    votes: number;
};

export type Issue = {
    id: string;
    slug: string;
    title: string;
    category: string;
    status: 'פעיל' | 'הסתיים' | 'בקרוב';
    deadline: string;
    totalVotes: number;
    description: string;
    background: string;
    sides: Side[];
    teams: Team[];
    experts: Expert[];
    pollQuestion: string;
    pollOptions: PollOption[];
    expertConsensus: { sideId: string; weight: number }[];
};

export const issues: Issue[] = [
    {
        id: '1',
        slug: 'public-transport-shabbat',
        title: 'תחבורה ציבורית בשבת',
        category: 'דת ומדינה',
        status: 'פעיל',
        deadline: '2026-07-30',
        totalVotes: 482314,
        description:
            'האם להפעיל תחבורה ציבורית מצומצמת בשבת באזורים חילוניים מובהקים, תוך שמירה על אזורים מסורתיים ודתיים?',
        background:
            'הסוגיה עולה לדיון מחודש לאחר פניות תושבים מערים גדולות. ההצעה הנוכחית כוללת קווי לילה מצומצמים בלבד, ללא מעבר באזורים דתיים, עם תמחור מותאם.',
        sides: [
            {
                id: 'pro',
                label: 'בעד',
                color: '#10b981',
                summary: 'תחבורה ציבורית בשבת היא זכות בסיסית של תושבים ללא רכב פרטי.',
                arguments: [
                    'שוויון בנגישות לבילוי, פנאי ועבודה גם ללא רכב פרטי',
                    'הפחתת תאונות דרכים בשבת ב-12% לפי מחקר משווה אירופאי',
                    'חיסכון של 1.4 מיליארד ש"ח שנתי במשפחות צעירות',
                    'שמירה על האזורים הדתיים – לא יעברו אוטובוסים בשכונות חרדיות'
                ]
            },
            {
                id: 'con',
                label: 'נגד',
                color: '#ef4444',
                summary: 'פגיעה בסטטוס קוו ובאופי הציבורי של השבת במרחב.',
                arguments: [
                    'הסטטוס קוו שמר על איזון עדין במשך 75 שנה',
                    'עלות תפעולית גבוהה לקופת המדינה',
                    'פגיעה בעובדי תחבורה ציבורית שיידרשו לעבוד בשבת',
                    'יכול לשמש כתקדים להרחבות נוספות'
                ]
            },
            {
                id: 'compromise',
                label: 'פשרה',
                color: '#f59e0b',
                summary: 'הפעלה בערים מסוימות בלבד, ועל פי החלטת הרשות המקומית.',
                arguments: [
                    'כל עיר תקיים משאל עם מקומי ותחליט בנפרד',
                    'התאמה אזורית – פתרון לתל אביב לא מתאים לבני ברק',
                    'עלות נמוכה ועלייה הדרגתית',
                    'שמירה על עקרון הביזור והדמוקרטיה המקומית'
                ]
            }
        ],
        teams: [
            {
                id: 't1',
                name: 'צוות תחבורה וכלכלה',
                field: 'תחבורה',
                members: 7,
                leadExpert: 'פרופ\' מיכל ברנע',
                description: 'מומחים לתכנון תחבורתי וכלכלה ציבורית',
                sideId: 'pro'
            },
            {
                id: 't2',
                name: 'צוות חברה ודת',
                field: 'סוציולוגיה',
                members: 5,
                leadExpert: 'ד"ר יוסף לוי',
                description: 'חוקרים תהליכים של דת ומדינה בישראל',
                sideId: 'con'
            },
            {
                id: 't3',
                name: 'צוות שלטון מקומי',
                field: 'משפט ציבורי',
                members: 6,
                leadExpert: 'עו"ד דנה שפירא',
                description: 'מומחים למשפט מנהלי ושלטון מקומי',
                sideId: 'compromise'
            },
            {
                id: 't4',
                name: 'צוות בטיחות בדרכים',
                field: 'בטיחות',
                members: 4,
                leadExpert: 'מהנדס איתי כהן',
                description: 'חוקרי תאונות וסטטיסטיקה ענפית',
                sideId: 'pro'
            }
        ],
        experts: [
            {
                id: 'e1',
                name: 'פרופ\' מיכל ברנע',
                title: 'פרופסור לתכנון תחבורתי',
                affiliation: 'הטכניון',
                avatar: 'מ',
                sideId: 'pro',
                score: 92,
                reasoning: 'נתונים השוואתיים מאירופה תומכים, השפעה ניתנת למדידה ומדידה.'
            },
            {
                id: 'e2',
                name: 'ד"ר יוסף לוי',
                title: 'חוקר דת ומדינה',
                affiliation: 'בר-אילן',
                avatar: 'י',
                sideId: 'con',
                score: 88,
                reasoning: 'הסטטוס קוו תפקד היטב, פתיחתו עלולה ליצור גרירת קונפליקטים.'
            },
            {
                id: 'e3',
                name: 'עו"ד דנה שפירא',
                title: 'מומחית למשפט ציבורי',
                affiliation: 'תל אביב',
                avatar: 'ד',
                sideId: 'compromise',
                score: 95,
                reasoning: 'פתרון מקומי מאזן בין צרכים שונים בכל יישוב.'
            },
            {
                id: 'e4',
                name: 'מהנדס איתי כהן',
                title: 'חוקר בטיחות בדרכים',
                affiliation: 'הרשות הלאומית',
                avatar: 'א',
                sideId: 'pro',
                score: 84,
                reasoning: 'הפחתת תאונות בלילות סופ"ש משמעותית סטטיסטית.'
            },
            {
                id: 'e5',
                name: 'הרב משה גולדברג',
                title: 'רב קהילה',
                affiliation: 'מועצת הרבנים',
                avatar: 'מ',
                sideId: 'con',
                score: 78,
                reasoning: 'חשיבות סמלית של השבת בזהות הישראלית.'
            },
            {
                id: 'e6',
                name: 'ד"ר נועה רוזנברג',
                title: 'כלכלנית בכירה',
                affiliation: 'בנק ישראל',
                avatar: 'נ',
                sideId: 'compromise',
                score: 87,
                reasoning: 'גישה הדרגתית מאפשרת הערכה כלכלית מדודה.'
            }
        ],
        pollQuestion: 'מה דעתך על הפעלת תחבורה ציבורית מצומצמת בשבת?',
        pollOptions: [
            { sideId: 'pro', label: 'בעד הפעלה מלאה', votes: 213245 },
            { sideId: 'con', label: 'נגד – שמירה על סטטוס קוו', votes: 142881 },
            { sideId: 'compromise', label: 'בעד הסדר מקומי', votes: 126188 }
        ],
        expertConsensus: [
            { sideId: 'pro', weight: 34 },
            { sideId: 'con', weight: 24 },
            { sideId: 'compromise', weight: 42 }
        ]
    },
    {
        id: '2',
        slug: 'electoral-reform',
        title: 'רפורמת אחוז החסימה',
        category: 'ממשל ופוליטיקה',
        status: 'פעיל',
        deadline: '2026-08-15',
        totalVotes: 318760,
        description:
            'האם להעלות את אחוז החסימה לכנסת מ-3.25% ל-5%, כדי לצמצם את מספר המפלגות הקטנות?',
        background:
            'ההצעה עולה לאחר 7 בחירות בלבד בעשור האחרון. תומכים טוענים ליציבות, מתנגדים חוששים מפגיעה בייצוג מיעוטים.',
        sides: [
            {
                id: 'pro',
                label: 'בעד העלאה',
                color: '#10b981',
                summary: 'יציבות פוליטית והפסקת ריבוי המפלגות.',
                arguments: [
                    'הפחתת מפלגות סחטניות בקואליציה',
                    'יציבות ממשלתית – פחות מעבר בחירות',
                    'התאמה לסטנדרט דמוקרטי אירופי',
                    'חיסכון של מיליארדי שקלים מעלויות בחירות חוזרות'
                ]
            },
            {
                id: 'con',
                label: 'נגד העלאה',
                color: '#ef4444',
                summary: 'פגיעה בייצוג של מיעוטים וקבוצות חלשות.',
                arguments: [
                    'פגיעה בייצוג ערבי, חרדי ומגזרים נוספים',
                    'הקטנת רב-גוניות פוליטית',
                    'יתרון לא הוגן למפלגות הגדולות הקיימות',
                    'מאות אלפי קולות יזרקו לטמיון'
                ]
            }
        ],
        teams: [
            {
                id: 't1',
                name: 'צוות מדע המדינה',
                field: 'מדע המדינה',
                members: 8,
                leadExpert: 'פרופ\' רונית גילאי',
                description: 'מומחי דמוקרטיה השוואתית',
                sideId: 'pro'
            },
            {
                id: 't2',
                name: 'צוות זכויות אזרח',
                field: 'משפט חוקתי',
                members: 5,
                leadExpert: 'עו"ד אמיר אברמוביץ',
                description: 'מומחים לזכויות מיעוטים',
                sideId: 'con'
            }
        ],
        experts: [
            {
                id: 'e1',
                name: 'פרופ\' רונית גילאי',
                title: 'פרופסור למדע המדינה',
                affiliation: 'האוניברסיטה העברית',
                avatar: 'ר',
                sideId: 'pro',
                score: 91,
                reasoning: 'מחקרים השוואתיים מראים יציבות גבוהה יותר בסף של 5%.'
            },
            {
                id: 'e2',
                name: 'עו"ד אמיר אברמוביץ',
                title: 'מומחה למשפט חוקתי',
                affiliation: 'האקדמית ת"א',
                avatar: 'א',
                sideId: 'con',
                score: 89,
                reasoning: 'פגיעה אנושה בעקרון הייצוגיות והרב-גוניות.'
            },
            {
                id: 'e3',
                name: 'ד"ר עינת בן-דוד',
                title: 'חוקרת שיטות בחירה',
                affiliation: 'המכון לדמוקרטיה',
                avatar: 'ע',
                sideId: 'pro',
                score: 85,
                reasoning: 'איזון נכון בין ייצוג ליציבות.'
            }
        ],
        pollQuestion: 'האם תתמוך בהעלאת אחוז החסימה ל-5%?',
        pollOptions: [
            { sideId: 'pro', label: 'בעד העלאה ל-5%', votes: 178432 },
            { sideId: 'con', label: 'נגד – להשאיר 3.25%', votes: 140328 }
        ],
        expertConsensus: [
            { sideId: 'pro', weight: 58 },
            { sideId: 'con', weight: 42 }
        ]
    },
    {
        id: '3',
        slug: 'climate-carbon-tax',
        title: 'מיסוי פליטות פחמן',
        category: 'סביבה ואקלים',
        status: 'פעיל',
        deadline: '2026-09-01',
        totalVotes: 156890,
        description:
            'האם להטיל מס פחמן הדרגתי על תעשיות מזהמות, עם החזר חלקי לאזרחים?',
        background:
            'בעקבות התחייבויות ישראל בוועידת האקלים, ההצעה מציעה מס שיתחיל ב-30 ש"ח/טון ויעלה ל-150 ש"ח/טון תוך עשור.',
        sides: [
            {
                id: 'pro',
                label: 'בעד',
                color: '#10b981',
                summary: 'צעד חיוני להתמודדות עם משבר האקלים.',
                arguments: [
                    'עמידה בהתחייבויות בינלאומיות',
                    'דחיפה לתעשייה לחדש ולעבור לאנרגיה נקייה',
                    'הקטנת זיהום אוויר ותחלואה',
                    'הכנסה למדינה שיכולה לשמש להחזר אזרחי'
                ]
            },
            {
                id: 'con',
                label: 'נגד',
                color: '#ef4444',
                summary: 'פגיעה בתעשייה ובמחירים לצרכן.',
                arguments: [
                    'התייקרות מוצרים בסיסיים',
                    'פגיעה בתחרותיות התעשייה הישראלית',
                    'אובדן עבודות בתעשייה כבדה',
                    'הזיהום יעבור למדינות אחרות'
                ]
            }
        ],
        teams: [
            {
                id: 't1',
                name: 'צוות אקלים וסביבה',
                field: 'מדעי הסביבה',
                members: 9,
                leadExpert: 'פרופ\' תמר אלון',
                description: 'מומחים בינלאומיים לכלכלת אקלים',
                sideId: 'pro'
            },
            {
                id: 't2',
                name: 'צוות תעשייה וכלכלה',
                field: 'כלכלה',
                members: 6,
                leadExpert: 'ד"ר רון שטיינברג',
                description: 'מומחי תעשייה ומסחר בינלאומי',
                sideId: 'con'
            }
        ],
        experts: [
            {
                id: 'e1',
                name: 'פרופ\' תמר אלון',
                title: 'פרופסור לכלכלת סביבה',
                affiliation: 'מכון ויצמן',
                avatar: 'ת',
                sideId: 'pro',
                score: 96,
                reasoning: 'דחיפות אקלימית מצריכה פעולה מיידית ומדידה.'
            },
            {
                id: 'e2',
                name: 'ד"ר רון שטיינברג',
                title: 'חוקר תעשייה',
                affiliation: 'מכון אהרן',
                avatar: 'ר',
                sideId: 'con',
                score: 82,
                reasoning: 'חשש כבד לתעשייה הישראלית במצב הגאופוליטי הנוכחי.'
            }
        ],
        pollQuestion: 'האם תתמוך בהטלת מס פחמן הדרגתי?',
        pollOptions: [
            { sideId: 'pro', label: 'בעד הטלת מס פחמן', votes: 92534 },
            { sideId: 'con', label: 'נגד הטלת מס נוסף', votes: 64356 }
        ],
        expertConsensus: [
            { sideId: 'pro', weight: 71 },
            { sideId: 'con', weight: 29 }
        ]
    },
    {
        id: '4',
        slug: 'housing-young-couples',
        title: 'דיור בר השגה לזוגות צעירים',
        category: 'דיור וחברה',
        status: 'פעיל',
        deadline: '2026-07-20',
        totalVotes: 624810,
        description:
            'איזה פתרון מועדף לבעיית הדיור: סבסוד מאסיבי, שחרור קרקעות מואץ, או מיסוי דירות שלישיות?',
        background:
            'משבר הדיור החמיר ב-3 השנים האחרונות. מחיר דירה ממוצע גדל ב-47% בעוד השכר עלה ב-9%.',
        sides: [
            {
                id: 'option-a',
                label: 'סבסוד ממשלתי',
                color: '#3b82f6',
                summary: 'מענק של 250 אלף ש"ח לזוג צעיר ראשון.',
                arguments: [
                    'עזרה מיידית למאות אלפי זוגות',
                    'יציבות חברתית וכלכלית',
                    'דחיפה לכלכלה המקומית',
                    'מנגנון פשוט ומוכר'
                ]
            },
            {
                id: 'option-b',
                label: 'שחרור קרקעות',
                color: '#10b981',
                summary: 'הפשרת קרקעות חקלאיות והאצת תכניות בניה.',
                arguments: [
                    'הגדלת היצע ארוכת טווח',
                    'הפחתת מחירים אורגנית',
                    'ללא עלות לקופה הציבורית',
                    'פתרון מבני אמיתי'
                ]
            },
            {
                id: 'option-c',
                label: 'מיסוי דירות נוספות',
                color: '#f59e0b',
                summary: 'מס מוגבר על משקיעים ובעלי 3+ דירות.',
                arguments: [
                    'פגיעה בספקולציה בשוק הדיור',
                    'הגדלת היצע השכרה',
                    'הכנסה למדינה למימון סבסוד',
                    'צדק חלוקתי'
                ]
            }
        ],
        teams: [
            {
                id: 't1',
                name: 'צוות כלכלת דיור',
                field: 'כלכלה',
                members: 11,
                leadExpert: 'פרופ\' שירה מזרחי',
                description: 'מומחי שוק הנדל"ן הישראלי',
                sideId: 'option-c'
            },
            {
                id: 't2',
                name: 'צוות תכנון ובנייה',
                field: 'אדריכלות',
                members: 7,
                leadExpert: 'אדריכלית טלי דוידוב',
                description: 'מומחי תכנון עירוני',
                sideId: 'option-b'
            },
            {
                id: 't3',
                name: 'צוות רווחה חברתית',
                field: 'מדיניות ציבורית',
                members: 5,
                leadExpert: 'ד"ר אבי שמש',
                description: 'מומחי רווחה ומדיניות חברתית',
                sideId: 'option-a'
            }
        ],
        experts: [
            {
                id: 'e1',
                name: 'פרופ\' שירה מזרחי',
                title: 'פרופסור לכלכלת נדל"ן',
                affiliation: 'אוניברסיטת ת"א',
                avatar: 'ש',
                sideId: 'option-c',
                score: 90,
                reasoning: 'מיסוי דירות הוא הכלי החזק ביותר להורדת מחירים.'
            },
            {
                id: 'e2',
                name: 'אדריכלית טלי דוידוב',
                title: 'מתכננת ערים',
                affiliation: 'משרד הפנים',
                avatar: 'ט',
                sideId: 'option-b',
                score: 86,
                reasoning: 'רק הגדלת היצע תפתור את הבעיה לטווח הארוך.'
            },
            {
                id: 'e3',
                name: 'ד"ר אבי שמש',
                title: 'חוקר רווחה',
                affiliation: 'בן-גוריון',
                avatar: 'א',
                sideId: 'option-a',
                score: 79,
                reasoning: 'מענק ישיר מבטיח עזרה לאוכלוסייה הזקוקה ביותר.'
            }
        ],
        pollQuestion: 'איזה פתרון לדיור בר השגה אתה תומך בו?',
        pollOptions: [
            { sideId: 'option-a', label: 'סבסוד ישיר', votes: 198432 },
            { sideId: 'option-b', label: 'שחרור קרקעות', votes: 165284 },
            { sideId: 'option-c', label: 'מיסוי דירות נוספות', votes: 261094 }
        ],
        expertConsensus: [
            { sideId: 'option-a', weight: 22 },
            { sideId: 'option-b', weight: 38 },
            { sideId: 'option-c', weight: 40 }
        ]
    }
];

export function getIssue(slug: string): Issue | undefined {
    return issues.find((i) => i.slug === slug);
}

export function getSideColor(issue: Issue, sideId: string): string {
    return issue.sides.find((s) => s.id === sideId)?.color || '#64748b';
}

export function getSideLabel(issue: Issue, sideId: string): string {
    return issue.sides.find((s) => s.id === sideId)?.label || sideId;
}
