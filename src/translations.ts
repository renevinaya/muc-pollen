const languagesRaw = ['de', 'en', 'ja'] as const;
const languages = [...languagesRaw, 'la'] as const
export type language = typeof languages[number];
type ITranslation = Record<language, string>;
type ITranslationRaw = Record<typeof languagesRaw[number], string>;

export function getBrowserLanguage(): language {
    for(const language of languages) {
        if (navigator.language.startsWith(language)) {
            return language;
        }
    }
    // Fallback to English if no match is found
    return 'en';
}

export const displayNames: ITranslation = {
    'de': 'Deutsch',
    'en': 'English',
    'ja': '日本語',
    'la': 'Latinum'
} as const;

export const translations: { [id: string]: ITranslationRaw } = {
    'Abies': {
        'de': 'Tanne',
        'en': 'Fir',
        'ja': 'モミ属'
    },
    'Acer': {
        'de': 'Ahorn',
        'en': 'Maple',
        'ja': 'カエデ'
    },
    'Aesculus': {
        'de': 'Rosskastanie',
        'en': 'Horse Chestnut',
        'ja': 'トチノキ'
    },
    'Alnus': {
        'de': 'Erle',
        'en': 'Alder',
        'ja': 'ハンノキ属'
    },
    'Ambrosia': {
        'de': 'Traubenkräuter',
        'en': 'Ragweed',
        'ja': 'ブタクサ'
    },
    'Artemisia': {
        'de': 'Beifuß',
        'en': 'Mugwort',
        'ja': 'ヨモギ'
    },
    'Asteraceae': {
        'de': 'Korbblütler',
        'en': 'Daisy',
        'ja': 'キク科'
    },
    'Betula': {
        'de': 'Birke',
        'en': 'Birch',
        'ja': 'カバノキ属'
    },
    'Carpinus': {
        'de': 'Hainbuchen',
        'en': 'Hornbeams',
        'ja': 'シデ'
    },
    'Castanea': {
        'de': 'Kastanien',
        'en': 'Chestnut',
        'ja': 'クリ属'
    },
    'Chenopodium': {
        'de': 'Gänsefüße',
        'en': 'Goosefoot',
        'ja': 'アカザ'
    },
    'Corylus': {
        'de': 'Hasel',
        'en': 'Hazel',
        'ja': 'ハシバミ属'
    },
    'Cruciferae': {
        'de': 'Kreuzblütler',
        'en': 'Mustards',
        'ja': 'アブラナ科'
    },
    'Cyperaceae': {
        'de': 'Sauergras',
        'en': 'Sedges',
        'ja': 'カヤツリグサ科'
    },
    'Erica': {
        'de': 'Heidekräuter',
        'en': 'Heath',
        'ja': 'エリカ属'
    },
    'Fagus': {
        'de': 'Buche',
        'en': 'Beech',
        'ja': 'ブナ属'
    },
    'Fraxinus': {
        'de': 'Esche',
        'en': 'Ash',
        'ja': 'トネリコ属'
    },
    'Fungus': {
        'de': 'Schimmel',
        'en': 'Mold',
        'ja': 'カビ'
    },
    'Galium': {
        'de': 'Labkräuter',
        'en': 'Bedstraw',
        'ja': 'キバナカワラマツバ'
    },
    'Humulus': {
        'de': 'Hopfen',
        'en': 'Hops',
        'ja': 'ホップ属'
    },
    'Impatiens': {
        'de': 'Springkraut',
        'en': 'Balsam',
        'ja': 'ツリフネソウ属'
    },
    'Juglans': {
        'de': 'Walnuss',
        'en': 'Walnut',
        'ja': 'クルミ'
    },
    'Larix': {
        'de': 'Lärchen',
        'en': 'Larch',
        'ja': 'カラマツ属'
    },
    'Picea': {
        'de': 'Fichten',
        'en': 'Spruce',
        'ja': 'トウヒ属'
    },
    'Pinaceae': {
        'de': 'Kieferngewächse',
        'en': 'Pine',
        'ja': 'マツ科'
    },
    'Pinus': {
        'de': 'Kiefern',
        'en': 'Pine',
        'ja': 'マツ属'
    },
    'Plantago': {
        'de': 'Wegerich',
        'en': 'Plantain',
        'ja': 'オオバコ属'
    },
    'Platanus': {
        'de': 'Platanen',
        'en': 'Plane',
        'ja': 'プラタナス'
    },
    'Poaceae': {
        'de': 'Gräser',
        'en': 'Grass',
        'ja': 'イネ科'
    },
    'Populus': {
        'de': 'Pappeln',
        'en': 'Poplar',
        'ja': 'ポプラ'
    },
    'Quercus': {
        'de': 'Eichen',
        'en': 'Oak',
        'ja': 'コナラ'
    },
    'Quercus ilex': {
        'de': 'Steineiche',
        'en': 'Holm oak',
        'ja': 'セイヨウヒイラギガシ'
    },
    'Rumex': {
        'de': 'Sauerampfer',
        'en': 'Dock',
        'ja': 'スイバ'
    },
    'Salix': {
        'de': 'Weide',
        'en': 'Willow',
        'ja': 'ヤナギ'
    },
    'Sambucus': {
        'de': 'Holunder',
        'en': 'Elder',
        'ja': 'ニワトコ属'
    },
    'Secale': {
        'de': 'Roggen',
        'en': 'Rye',
        'ja': 'ライ麦'
    },
    'Taxus': {
        'de': 'Eibe',
        'en': 'Yew',
        'ja': 'イチイ属'
    },
    'Tilia': {
        'de': 'Linden',
        'en': 'Linden',
        'ja': 'シナノキ属'
    },
    'Ulmus': {
        'de': 'Ulmen',
        'en': 'Elm',
        'ja': 'ハルニレ'
    },
    'Urtica': {
        'de': 'Brennnessel',
        'en': 'Nettle',
        'ja': 'イラクサ属'
    }
}

export const ui: Record<string, ITranslation> = {
    'title': {
        'de': 'Pollen in München',
        'en': 'Pollen in Munich',
        'ja': 'ミュンヘンの花粉',
        'la': 'Pollen Monacense'
    },
    'noPollen': {
        'de': 'Derzeit kein Pollenflug in München!',
        'en': 'Currently no pollen in Munich!',
        'ja': '現在ミュンヘンでは花粉は飛んでいません！',
        'la': 'Nunc nullum pollen Monaci!'
    },
    'error': {
        'de': 'Ein Fehler ist aufgetreten!',
        'en': 'An error occurred!',
        'ja': 'エラーが発生しました！',
        'la': 'Error accidit!'
    },
    'tryAgain': {
        'de': 'Erneut versuchen',
        'en': 'Try again',
        'ja': '再試行',
        'la': 'Iterum tempta'
    },
    'noMeasurement': {
        'de': 'Pollenmessung derzeit nicht verfügbar',
        'en': 'Pollen measurement currently not available',
        'ja': '花粉測定は現在利用できません',
        'la': 'Mensura pollinis nunc non praesto est'
    },
    'madeBy': {
        'de': 'Erstellt von',
        'en': 'Made by',
        'ja': '作成者：',
        'la': 'Fecit'
    },
    'withDataFrom': {
        'de': 'mit Daten von',
        'en': 'with data from',
        'ja': '、データ提供：',
        'la': 'cum datis ex'
    },
    'hostedBy': {
        'de': 'Gehostet von',
        'en': 'Hosted by',
        'ja': 'ホスティング：',
        'la': 'Hospitatur ab'
    },
    'privacyRegulations': {
        'de': 'Datenschutzbestimmungen',
        'en': 'data privacy regulations',
        'ja': 'のデータプライバシー規約を確認してください',
        'la': 'normas secreti datorum'
    }
}
