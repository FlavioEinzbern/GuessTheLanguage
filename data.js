/**
 * ============================================================================
 * WIKIPEDIA LANGUAGE DATABASE & SCRIPT MAPPINGS
 * ============================================================================
 * Contains all language editions, writing scripts, language families,
 * pool classifications ('stable' vs 'experimental'), and custom categories.
 */

const WIKI_LANGUAGES = [
  // EUROPEAN
  { code: 'en', name: 'English', native: 'English', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['european'] },
  { code: 'de', name: 'German', native: 'Deutsch', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['european'] },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['european'] },
  { code: 'sv', name: 'Swedish', native: 'Svenska', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['european'] },
  { code: 'da', name: 'Danish', native: 'Dansk', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['european'] },
  { code: 'no', name: 'Norwegian', native: 'Norsk', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['european'] },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['european'] },
  { code: 'fr', name: 'French', native: 'Français', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  { code: 'es', name: 'Spanish', native: 'Español', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  { code: 'pt', name: 'Portuguese', native: 'Português', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  { code: 'it', name: 'Italian', native: 'Italiano', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  { code: 'ro', name: 'Romanian', native: 'Română', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  { code: 'ca', name: 'Catalan', native: 'Català', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  { code: 'gl', name: 'Galician', native: 'Galego', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  { code: 'pl', name: 'Polish', native: 'Polski', script: 'Latin', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'cs', name: 'Czech', native: 'Čeština', script: 'Latin', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', script: 'Latin', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', script: 'Latin', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', script: 'Latin', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski', script: 'Latin', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'ru', name: 'Russian', native: 'Русский', script: 'Cyrillic', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', script: 'Cyrillic', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'be', name: 'Belarusian', native: 'Беларуская', script: 'Cyrillic', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'bg', name: 'Bulgarian', native: 'Български', script: 'Cyrillic', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'sr', name: 'Serbian', native: 'Српски', script: 'Cyrillic', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', script: 'Cyrillic', family: 'Slavic', pool: 'stable', cats: ['european'] },
  { code: 'fi', name: 'Finnish', native: 'Suomi', script: 'Latin', family: 'Uralic', pool: 'stable', cats: ['european'] },
  { code: 'et', name: 'Estonian', native: 'Eesti', script: 'Latin', family: 'Uralic', pool: 'stable', cats: ['european'] },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', script: 'Latin', family: 'Uralic', pool: 'stable', cats: ['european'] },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', script: 'Latin', family: 'Baltic', pool: 'stable', cats: ['european'] },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', script: 'Latin', family: 'Baltic', pool: 'stable', cats: ['european'] },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', script: 'Greek', family: 'Hellenic', pool: 'stable', cats: ['european'] },
  { code: 'sq', name: 'Albanian', native: 'Shqip', script: 'Latin', family: 'Indo-European', pool: 'stable', cats: ['european'] },
  { code: 'eu', name: 'Basque', native: 'Euskara', script: 'Latin', family: 'Isolate', pool: 'stable', cats: ['european'] },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', script: 'Latin', family: 'Celtic', pool: 'stable', cats: ['european'] },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', script: 'Latin', family: 'Celtic', pool: 'stable', cats: ['european'] },
  { code: 'eo', name: 'Esperanto', native: 'Esperanto', script: 'Latin', family: 'Constructed', pool: 'stable', cats: ['european'] },
  { code: 'la', name: 'Latin', native: 'Latina', script: 'Latin', family: 'Romance', pool: 'stable', cats: ['european'] },
  // Experimental European
  { code: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch', script: 'Latin', family: 'Germanic', pool: 'experimental', cats: ['european'] },
  { code: 'fy', name: 'Western Frisian', native: 'Frysk', script: 'Latin', family: 'Germanic', pool: 'experimental', cats: ['european'] },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', script: 'Latin', family: 'Germanic', pool: 'stable', cats: ['african', 'european'] },
  { code: 'oc', name: 'Occitan', native: 'Occitan', script: 'Latin', family: 'Romance', pool: 'experimental', cats: ['european'] },
  { code: 'ast', name: 'Asturian', native: 'Asturianu', script: 'Latin', family: 'Romance', pool: 'experimental', cats: ['european'] },
  { code: 'an', name: 'Aragonese', native: 'Aragonés', script: 'Latin', family: 'Romance', pool: 'experimental', cats: ['european'] },
  { code: 'scn', name: 'Sicilian', native: 'Sicilianu', script: 'Latin', family: 'Romance', pool: 'experimental', cats: ['european'] },
  { code: 'br', name: 'Breton', native: 'Brezhoneg', script: 'Latin', family: 'Celtic', pool: 'experimental', cats: ['european'] },
  { code: 'gd', name: 'Scottish Gaelic', native: 'Gàidhlig', script: 'Latin', family: 'Celtic', pool: 'experimental', cats: ['european'] },
  { code: 'mt', name: 'Maltese', native: 'Malti', script: 'Latin', family: 'Semitic', pool: 'experimental', cats: ['european'] },
  { code: 'yi', name: 'Yiddish', native: 'ייִדיש', script: 'Hebrew', family: 'Germanic', pool: 'experimental', cats: ['european'] },
  { code: 'se', name: 'Northern Sami', native: 'Davvisámegiella', script: 'Latin', family: 'Uralic', pool: 'experimental', cats: ['european', 'indigenous'] },

  // ASIAN
  { code: 'tr', name: 'Turkish', native: 'Türkçe', script: 'Latin', family: 'Turkic', pool: 'stable', cats: ['asian', 'european'] },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycanca', script: 'Latin', family: 'Turkic', pool: 'stable', cats: ['asian'] },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbekcha', script: 'Latin', family: 'Turkic', pool: 'stable', cats: ['asian'] },
  { code: 'kk', name: 'Kazakh', native: 'Қазақша', script: 'Cyrillic', family: 'Turkic', pool: 'stable', cats: ['asian'] },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча', script: 'Cyrillic', family: 'Turkic', pool: 'experimental', cats: ['asian'] },
  { code: 'mn', name: 'Mongolian', native: 'Монгол', script: 'Cyrillic', family: 'Mongolic', pool: 'experimental', cats: ['asian'] },
  { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', script: 'Cyrillic', family: 'Iranian', pool: 'experimental', cats: ['asian'] },
  { code: 'ar', name: 'Arabic', native: 'العربية', script: 'Arabic', family: 'Semitic', pool: 'stable', cats: ['asian', 'african'] },
  { code: 'fa', name: 'Persian', native: 'فارسی', script: 'Arabic', family: 'Iranian', pool: 'stable', cats: ['asian'] },
  { code: 'ur', name: 'Urdu', native: 'اردو', script: 'Arabic', family: 'Indo-Aryan', pool: 'stable', cats: ['asian'] },
  { code: 'ps', name: 'Pashto', native: 'پښتو', script: 'Arabic', family: 'Iranian', pool: 'experimental', cats: ['asian'] },
  { code: 'ckb', name: 'Central Kurdish', native: 'کوردی', script: 'Arabic', family: 'Iranian', pool: 'experimental', cats: ['asian'] },
  { code: 'he', name: 'Hebrew', native: 'עברית', script: 'Hebrew', family: 'Semitic', pool: 'stable', cats: ['asian'] },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', script: 'Devanagari', family: 'Indo-Aryan', pool: 'stable', cats: ['asian'] },
  { code: 'mr', name: 'Marathi', native: 'मराठी', script: 'Devanagari', family: 'Indo-Aryan', pool: 'stable', cats: ['asian'] },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', script: 'Devanagari', family: 'Indo-Aryan', pool: 'stable', cats: ['asian'] },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', script: 'Devanagari', family: 'Indo-Aryan', pool: 'experimental', cats: ['asian'] },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', script: 'Bengali', family: 'Indo-Aryan', pool: 'stable', cats: ['asian'] },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', family: 'Indo-Aryan', pool: 'stable', cats: ['asian'] },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', script: 'Gujarati', family: 'Indo-Aryan', pool: 'stable', cats: ['asian'] },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', script: 'Tamil', family: 'Dravidian', pool: 'stable', cats: ['asian'] },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', script: 'Telugu', family: 'Dravidian', pool: 'stable', cats: ['asian'] },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', script: 'Kannada', family: 'Dravidian', pool: 'stable', cats: ['asian'] },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', script: 'Malayalam', family: 'Dravidian', pool: 'stable', cats: ['asian'] },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', script: 'Sinhala', family: 'Indo-Aryan', pool: 'experimental', cats: ['asian'] },
  { code: 'th', name: 'Thai', native: 'ไทย', script: 'Thai', family: 'Tai-Kadai', pool: 'stable', cats: ['asian'] },
  { code: 'my', name: 'Burmese', native: 'မြန်မာဘာသာ', script: 'Myanmar', family: 'Sino-Tibetan', pool: 'experimental', cats: ['asian'] },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ', script: 'Khmer', family: 'Austroasiatic', pool: 'experimental', cats: ['asian'] },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', script: 'Latin', family: 'Austroasiatic', pool: 'stable', cats: ['asian'] },
  { code: 'zh', name: 'Chinese', native: '中文', script: 'East-Asian', family: 'Sino-Tibetan', pool: 'stable', cats: ['asian'] },
  { code: 'yue', name: 'Cantonese', native: '粵語', script: 'East-Asian', family: 'Sino-Tibetan', pool: 'experimental', cats: ['asian'] },
  { code: 'ja', name: 'Japanese', native: '日本語', script: 'East-Asian', family: 'Japonic', pool: 'stable', cats: ['asian'] },
  { code: 'ko', name: 'Korean', native: '한국어', script: 'Hangul', family: 'Koreanic', pool: 'stable', cats: ['asian'] },
  { code: 'ka', name: 'Georgian', native: 'ქართული', script: 'Georgian', family: 'Kartvelian', pool: 'stable', cats: ['asian', 'european'] },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', script: 'Armenian', family: 'Indo-European', pool: 'stable', cats: ['asian', 'european'] },

  // AUSTRONESIAN
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', script: 'Latin', family: 'Austronesian', pool: 'stable', cats: ['austronesian', 'asian'] },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', script: 'Latin', family: 'Austronesian', pool: 'stable', cats: ['austronesian', 'asian'] },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog', script: 'Latin', family: 'Austronesian', pool: 'stable', cats: ['austronesian', 'asian'] },
  { code: 'jv', name: 'Javanese', native: 'Basa Jawa', script: 'Latin', family: 'Austronesian', pool: 'stable', cats: ['austronesian', 'asian'] },
  { code: 'su', name: 'Sundanese', native: 'Basa Sunda', script: 'Latin', family: 'Austronesian', pool: 'experimental', cats: ['austronesian', 'asian'] },
  { code: 'ceb', name: 'Cebuano', native: 'Cebuano', script: 'Latin', family: 'Austronesian', pool: 'experimental', cats: ['austronesian', 'asian'] },
  { code: 'ilo', name: 'Ilokano', native: 'Ilokano', script: 'Latin', family: 'Austronesian', pool: 'experimental', cats: ['austronesian', 'asian'] },
  { code: 'mg', name: 'Malagasy', native: 'Malagasy', script: 'Latin', family: 'Austronesian', pool: 'experimental', cats: ['austronesian', 'african'] },
  { code: 'mi', name: 'Maori', native: 'Māori', script: 'Latin', family: 'Austronesian', pool: 'experimental', cats: ['austronesian', 'indigenous'] },
  { code: 'haw', name: 'Hawaiian', native: 'Hawaiʻi', script: 'Latin', family: 'Austronesian', pool: 'experimental', cats: ['austronesian', 'indigenous'] },
  { code: 'sm', name: 'Samoan', native: 'Gagana Samoa', script: 'Latin', family: 'Austronesian', pool: 'experimental', cats: ['austronesian'] },

  // AFRICAN
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', script: 'Latin', family: 'Niger-Congo', pool: 'stable', cats: ['african'] },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá', script: 'Latin', family: 'Niger-Congo', pool: 'experimental', cats: ['african'] },
  { code: 'ha', name: 'Hausa', native: 'Hausa', script: 'Latin', family: 'Afroasiatic', pool: 'experimental', cats: ['african'] },
  { code: 'ig', name: 'Igbo', native: 'Igbo', script: 'Latin', family: 'Niger-Congo', pool: 'experimental', cats: ['african'] },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', script: 'Latin', family: 'Niger-Congo', pool: 'experimental', cats: ['african'] },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', script: 'Latin', family: 'Niger-Congo', pool: 'experimental', cats: ['african'] },
  { code: 'so', name: 'Somali', native: 'Soomaaliga', script: 'Latin', family: 'Afroasiatic', pool: 'experimental', cats: ['african'] },
  { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda', script: 'Latin', family: 'Niger-Congo', pool: 'experimental', cats: ['african'] },
  { code: 'sn', name: 'Shona', native: 'chiShona', script: 'Latin', family: 'Niger-Congo', pool: 'experimental', cats: ['african'] },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', script: 'Ethiopic', family: 'Semitic', pool: 'experimental', cats: ['african'] },

  // INDIGENOUS (AMERICAS / ARCTIC / OCEANIA)
  { code: 'qu', name: 'Quechua', native: 'Runa Simi', script: 'Latin', family: 'Indigenous-Americas', pool: 'experimental', cats: ['indigenous'] },
  { code: 'gn', name: 'Guarani', native: 'Avañe\'ẽ', script: 'Latin', family: 'Indigenous-Americas', pool: 'experimental', cats: ['indigenous'] },
  { code: 'ay', name: 'Aymara', native: 'Aymar aru', script: 'Latin', family: 'Indigenous-Americas', pool: 'experimental', cats: ['indigenous'] },
  { code: 'nah', name: 'Nahuatl', native: 'Nāhuatl', script: 'Latin', family: 'Indigenous-Americas', pool: 'experimental', cats: ['indigenous'] },
  { code: 'nv', name: 'Navajo', native: 'Diné bizaad', script: 'Latin', family: 'Indigenous-Americas', pool: 'experimental', cats: ['indigenous'] },
  { code: 'kl', name: 'Greenlandic', native: 'Kalaallisut', script: 'Latin', family: 'Inuit-Yupik', pool: 'experimental', cats: ['indigenous'] }
];

/**
 * Cross-Script & Regional Cousin Clusters for Medium Mode
 * Pairs languages that are linguistically/historically related or regional neighbors,
 * including pairs with different writing systems (e.g., Russian & Polish, Vietnamese & Chinese).
 */
const MEDIUM_COUSIN_CLUSTERS = [
  ['ru', 'pl', 'uk', 'cs', 'bg', 'sr', 'hr', 'sk', 'be', 'sl', 'mk', 'bs'],
  ['vi', 'zh', 'ja', 'ko', 'yue', 'th', 'km', 'my', 'id', 'ms', 'tl'],
  ['hi', 'ur', 'pa', 'bn', 'mr', 'gu', 'ne', 'fa', 'ta', 'te', 'ml', 'kn', 'si'],
  ['tr', 'az', 'kk', 'uz', 'ky', 'mn', 'tg', 'ru', 'fa', 'ka', 'hy'],
  ['ar', 'he', 'fa', 'tr', 'mt', 'am', 'ur', 'ckb', 'ps', 'sw', 'ha'],
  ['el', 'ru', 'bg', 'sr', 'mk', 'ro', 'it', 'tr', 'sq', 'hy', 'ka'],
  ['de', 'yi', 'nl', 'pl', 'cs', 'da', 'sv', 'no', 'af', 'en', 'lb', 'hu'],
  ['es', 'pt', 'it', 'fr', 'ro', 'ca', 'gl', 'qu', 'gn', 'nah', 'tl', 'eu']
];

const ALL_CATEGORIES = ['european', 'asian', 'african', 'austronesian', 'indigenous'];

/**
 * Visually Similar Macro-Script Groups for Hard Mode Fallback
 * Used when a target language's exact writing system has fewer than 3 distractors,
 * avoiding jarring jumps to unrelated scripts whenever possible.
 */
const HARD_MACRO_SCRIPT_GROUPS = [
  ['East-Asian', 'Hangul'],
  ['Arabic', 'Hebrew'],
  ['Devanagari', 'Bengali', 'Gurmukhi', 'Gujarati'],
  ['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Sinhala'],
  ['Thai', 'Khmer', 'Myanmar', 'Sinhala', 'Malayalam'],
  ['Greek', 'Georgian', 'Armenian', 'Ethiopic']
];

/**
 * Unicode Script Regular Expressions for verifying native character purity.
 */
const SCRIPT_CHAR_REGEX = {
  'Latin': /\p{Script=Latin}/u,
  'Cyrillic': /\p{Script=Cyrillic}/u,
  'Greek': /\p{Script=Greek}/u,
  'Arabic': /\p{Script=Arabic}/u,
  'Hebrew': /\p{Script=Hebrew}/u,
  'Devanagari': /\p{Script=Devanagari}/u,
  'Bengali': /\p{Script=Bengali}/u,
  'Gurmukhi': /\p{Script=Gurmukhi}/u,
  'Gujarati': /\p{Script=Gujarati}/u,
  'Tamil': /\p{Script=Tamil}/u,
  'Telugu': /\p{Script=Telugu}/u,
  'Kannada': /\p{Script=Kannada}/u,
  'Malayalam': /\p{Script=Malayalam}/u,
  'Sinhala': /\p{Script=Sinhala}/u,
  'Thai': /\p{Script=Thai}/u,
  'Myanmar': /\p{Script=Myanmar}/u,
  'Khmer': /\p{Script=Khmer}/u,
  'East-Asian': /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u,
  'Hangul': /\p{Script=Hangul}/u,
  'Georgian': /\p{Script=Georgian}/u,
  'Armenian': /\p{Script=Armenian}/u,
  'Ethiopic': /\p{Script=Ethiopic}/u
};
