/**
 * ============================================================================
 * WORLD TV NEWS BROADCASTERS DATABASE (Option A/B Hybrid)
 * ============================================================================
 * Maps national TV news broadcasters to their exact Country, Language,
 * YouTube Channel ID, Uploads Playlist ID (UU...), and curated broadcast IDs.
 */

const TV_NEWS_BROADCASTERS = [
  // SPANISH (Multiple Countries for Country Accent Battles)
  {
    id: 'es_rtve',
    broadcaster: 'RTVE Noticias (24h)',
    countryCode: 'ES',
    countryName: 'Spain',
    countryNative: 'España',
    flag: '🇪🇸',
    region: 'Europe',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UC7QZIf0dta-XPXsp9Hv4dTw',
    uploadsList: 'UU7QZIf0dta-XPXsp9Hv4dTw',
    videos: ['5qap5aO4i9A']
  },
  {
    id: 'mx_nmas',
    broadcaster: 'NMás (Noticieros Televisa)',
    countryCode: 'MX',
    countryName: 'Mexico',
    countryNative: 'México',
    flag: '🇲🇽',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UCUsm-fannqOY02kp56QpUmQ',
    uploadsList: 'UUUsm-fannqOY02kp56QpUmQ',
    videos: []
  },
  {
    id: 'ar_tn',
    broadcaster: 'Todo Noticias (TN)',
    countryCode: 'AR',
    countryName: 'Argentina',
    countryNative: 'Argentina',
    flag: '🇦🇷',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UCj6PcyLvpnIRT_2W_mwa9Aw',
    uploadsList: 'UUj6PcyLvpnIRT_2W_mwa9Aw',
    videos: []
  },
  {
    id: 'co_caracol',
    broadcaster: 'Noticias Caracol',
    countryCode: 'CO',
    countryName: 'Colombia',
    countryNative: 'Colombia',
    flag: '🇨🇴',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UC2Xq2PK-got3Rtz9ZJ32hLQ',
    uploadsList: 'UU2Xq2PK-got3Rtz9ZJ32hLQ',
    videos: []
  },
  {
    id: 'cl_t13',
    broadcaster: 'Teletrece (T13)',
    countryCode: 'CL',
    countryName: 'Chile',
    countryNative: 'Chile',
    flag: '🇨🇱',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UCsRnhjcUCR78Q3Ud6OXCTNg',
    uploadsList: 'UUsRnhjcUCR78Q3Ud6OXCTNg',
    videos: []
  },

  // ENGLISH (Multiple Countries)
  {
    id: 'gb_sky',
    broadcaster: 'Sky News',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    countryNative: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    family: 'Germanic',
    channelId: 'UCoMdktPbSTixAyNGwb-UYkQ',
    uploadsList: 'UUoMdktPbSTixAyNGwb-UYkQ',
    videos: []
  },
  {
    id: 'us_pbs',
    broadcaster: 'PBS NewsHour',
    countryCode: 'US',
    countryName: 'United States',
    countryNative: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    family: 'Germanic',
    channelId: 'UC6ZFN9Tx6xh-skXCuRHCDpQ',
    uploadsList: 'UU6ZFN9Tx6xh-skXCuRHCDpQ',
    videos: []
  },
  {
    id: 'au_abc',
    broadcaster: 'ABC News (Australia)',
    countryCode: 'AU',
    countryName: 'Australia',
    countryNative: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    family: 'Germanic',
    channelId: 'UCVgO39Bk5sMo66-6o6Spn6Q',
    uploadsList: 'UUVgO39Bk5sMo66-6o6Spn6Q',
    videos: []
  },
  {
    id: 'ca_cbc',
    broadcaster: 'CBC News',
    countryCode: 'CA',
    countryName: 'Canada',
    countryNative: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    family: 'Germanic',
    channelId: 'UCuFFtHWoLl5fauMMD5Ww2jA',
    uploadsList: 'UUuFFtHWoLl5fauMMD5Ww2jA',
    videos: []
  },

  // PORTUGUESE (Brazil & Portugal)
  {
    id: 'br_record',
    broadcaster: 'Jornal da Record',
    countryCode: 'BR',
    countryName: 'Brazil',
    countryNative: 'Brasil',
    flag: '🇧🇷',
    region: 'Americas',
    langCode: 'pt',
    langName: 'Portuguese',
    langNative: 'Português',
    family: 'Romance',
    channelId: 'UCmpHPgeCBgvk_fDXZQKsnAA',
    uploadsList: 'UUmpHPgeCBgvk_fDXZQKsnAA',
    videos: []
  },
  {
    id: 'pt_rtp',
    broadcaster: 'RTP Notícias',
    countryCode: 'PT',
    countryName: 'Portugal',
    countryNative: 'Portugal',
    flag: '🇵🇹',
    region: 'Europe',
    langCode: 'pt',
    langName: 'Portuguese',
    langNative: 'Português',
    family: 'Romance',
    channelId: 'UCvCTicalKYLm2XH1763rI1g',
    uploadsList: 'UUvCTicalKYLm2XH1763rI1g',
    videos: []
  },

  // FRENCH (France & Belgium/Canada)
  {
    id: 'fr_france24',
    broadcaster: 'France 24 (Français)',
    countryCode: 'FR',
    countryName: 'France',
    countryNative: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    langCode: 'fr',
    langName: 'French',
    langNative: 'Français',
    family: 'Romance',
    channelId: 'UCCCPCZNChQdGa9EkATeye4g',
    uploadsList: 'UUCCPCZNChQdGa9EkATeye4g',
    videos: []
  },

  // GERMAN (Germany & Austria)
  {
    id: 'de_tagesschau',
    broadcaster: 'ARD Tagesschau',
    countryCode: 'DE',
    countryName: 'Germany',
    countryNative: 'Deutschland',
    flag: '🇩🇪',
    region: 'Europe',
    langCode: 'de',
    langName: 'German',
    langNative: 'Deutsch',
    family: 'Germanic',
    channelId: 'UC5NOEUbkLheQcaaRldYW5GA',
    uploadsList: 'UU5NOEUbkLheQcaaRldYW5GA',
    videos: []
  },
  {
    id: 'de_dw',
    broadcaster: 'DW Deutsch',
    countryCode: 'AT',
    countryName: 'Austria',
    countryNative: 'Österreich',
    flag: '🇦🇹',
    region: 'Europe',
    langCode: 'de',
    langName: 'German',
    langNative: 'Deutsch',
    family: 'Germanic',
    channelId: 'UCMIgOXM2JEQ2Pv2d0_PVfcg',
    uploadsList: 'UUMIgOXM2JEQ2Pv2d0_PVfcg',
    videos: []
  },

  // ITALIAN
  {
    id: 'it_tgla7',
    broadcaster: 'TG La7',
    countryCode: 'IT',
    countryName: 'Italy',
    countryNative: 'Italia',
    flag: '🇮🇹',
    region: 'Europe',
    langCode: 'it',
    langName: 'Italian',
    langNative: 'Italiano',
    family: 'Romance',
    channelId: 'UC8I3-2358c27k6bW_2s5bCA',
    uploadsList: 'UU8I3-2358c27k6bW_2s5bCA',
    videos: []
  },

  // DUTCH
  {
    id: 'nl_nos',
    broadcaster: 'NOS Journaal',
    countryCode: 'NL',
    countryName: 'Netherlands',
    countryNative: 'Nederland',
    flag: '🇳🇱',
    region: 'Europe',
    langCode: 'nl',
    langName: 'Dutch',
    langNative: 'Nederlands',
    family: 'Germanic',
    channelId: 'UC5ab70js2B62N0G2B2rD-tQ',
    uploadsList: 'UU5ab70js2B62N0G2B2rD-tQ',
    videos: []
  },

  // POLISH
  {
    id: 'pl_polsat',
    broadcaster: 'Polsat News',
    countryCode: 'PL',
    countryName: 'Poland',
    countryNative: 'Polska',
    flag: '🇵🇱',
    region: 'Europe',
    langCode: 'pl',
    langName: 'Polish',
    langNative: 'Polski',
    family: 'Slavic',
    channelId: 'UCb7O4s237w_tK72m6313_hQ',
    uploadsList: 'UUb7O4s237w_tK72m6313_hQ',
    videos: []
  },

  // RUSSIAN
  {
    id: 'ru_currenttime',
    broadcaster: 'Current Time TV (Настоящее Время)',
    countryCode: 'RU',
    countryName: 'Russia',
    countryNative: 'Россия',
    flag: '🇷🇺',
    region: 'Europe',
    langCode: 'ru',
    langName: 'Russian',
    langNative: 'Русский',
    family: 'Slavic',
    channelId: 'UCBG57608Hukev3d0d-gvLhQ',
    uploadsList: 'UUBG57608Hukev3d0d-gvLhQ',
    videos: []
  },

  // UKRAINIAN
  {
    id: 'ua_tsn',
    broadcaster: 'TSN Ukraine (ТСН)',
    countryCode: 'UA',
    countryName: 'Ukraine',
    countryNative: 'Україна',
    flag: '🇺🇦',
    region: 'Europe',
    langCode: 'uk',
    langName: 'Ukrainian',
    langNative: 'Українська',
    family: 'Slavic',
    channelId: 'UCXoJ8kY9zpLBEz-8saaT3ew',
    uploadsList: 'UUXoJ8kY9zpLBEz-8saaT3ew',
    videos: []
  },

  // GREEK
  {
    id: 'gr_ert',
    broadcaster: 'ERT News (ΕΡΤ)',
    countryCode: 'GR',
    countryName: 'Greece',
    countryNative: 'Ελλάδα',
    flag: '🇬🇷',
    region: 'Europe',
    langCode: 'el',
    langName: 'Greek',
    langNative: 'Ελληνικά',
    family: 'Hellenic',
    channelId: 'UC0jV92z326tN5A4pX7M6N1w',
    uploadsList: 'UU0jV92z326tN5A4pX7M6N1w',
    videos: []
  },

  // ROMANIAN
  {
    id: 'ro_digi24',
    broadcaster: 'Digi24 HD',
    countryCode: 'RO',
    countryName: 'Romania',
    countryNative: 'România',
    flag: '🇷🇴',
    region: 'Europe',
    langCode: 'ro',
    langName: 'Romanian',
    langNative: 'Română',
    family: 'Romance',
    channelId: 'UC0055-t221_G41a-f7_f0vA',
    uploadsList: 'UU0055-t221_G41a-f7_f0vA',
    videos: []
  },

  // TURKISH
  {
    id: 'tr_trthaber',
    broadcaster: 'TRT Haber',
    countryCode: 'TR',
    countryName: 'Turkey',
    countryNative: 'Türkiye',
    flag: '🇹🇷',
    region: 'Asia',
    langCode: 'tr',
    langName: 'Turkish',
    langNative: 'Türkçe',
    family: 'Turkic',
    channelId: 'UCJetPM4222A233M1-3m4Q6A',
    uploadsList: 'UUJetPM4222A233M1-3m4Q6A',
    videos: []
  },

  // ARABIC (Qatar & Egypt)
  {
    id: 'qa_aljazeera',
    broadcaster: 'Al Jazeera Arabic (الجزيرة)',
    countryCode: 'QA',
    countryName: 'Qatar',
    countryNative: 'قطر',
    flag: '🇶🇦',
    region: 'Asia',
    langCode: 'ar',
    langName: 'Arabic',
    langNative: 'العربية',
    family: 'Semitic',
    channelId: 'UCfiwzLy-8yKzIbsmZTzxDgw',
    uploadsList: 'UUfiwzLy-8yKzIbsmZTzxDgw',
    videos: []
  },
  {
    id: 'ae_alarabiya',
    broadcaster: 'Al Arabiya (العربية)',
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    countryNative: 'السعودية',
    flag: '🇸🇦',
    region: 'Asia',
    langCode: 'ar',
    langName: 'Arabic',
    langNative: 'العربية',
    family: 'Semitic',
    channelId: 'UCahpxixMCwoANAftn6IxkTg',
    uploadsList: 'UUahpxixMCwoANAftn6IxkTg',
    videos: []
  },

  // PERSIAN
  {
    id: 'ir_bbcpersian',
    broadcaster: 'BBC News Persian',
    countryCode: 'IR',
    countryName: 'Iran',
    countryNative: 'ایران',
    flag: '🇮🇷',
    region: 'Asia',
    langCode: 'fa',
    langName: 'Persian',
    langNative: 'فارسی',
    family: 'Iranian',
    channelId: 'UC7fWeaHhqgM4Ry-RMpM2YYw',
    uploadsList: 'UU7fWeaHhqgM4Ry-RMpM2YYw',
    videos: []
  },

  // HEBREW
  {
    id: 'il_kan',
    broadcaster: 'KAN 11 News (כאן חדשות)',
    countryCode: 'IL',
    countryName: 'Israel',
    countryNative: 'ישראל',
    flag: '🇮🇱',
    region: 'Asia',
    langCode: 'he',
    langName: 'Hebrew',
    langNative: 'עברית',
    family: 'Semitic',
    channelId: 'UC_HWF22I27I5qE8c6sT53RA',
    uploadsList: 'UU_HWF22I27I5qE8c6sT53RA',
    videos: []
  },

  // HINDI
  {
    id: 'in_ndtv',
    broadcaster: 'NDTV India',
    countryCode: 'IN',
    countryName: 'India',
    countryNative: 'भारत',
    flag: '🇮🇳',
    region: 'Asia',
    langCode: 'hi',
    langName: 'Hindi',
    langNative: 'हिन्दी',
    family: 'Indo-Aryan',
    channelId: 'UC9CYT9gSNLevX5ey2_6CK0Q',
    uploadsList: 'UU9CYT9gSNLevX5ey2_6CK0Q',
    videos: []
  },

  // URDU
  {
    id: 'pk_geonews',
    broadcaster: 'Geo News',
    countryCode: 'PK',
    countryName: 'Pakistan',
    countryNative: 'پاکستان',
    flag: '🇵🇰',
    region: 'Asia',
    langCode: 'ur',
    langName: 'Urdu',
    langNative: 'اردو',
    family: 'Indo-Aryan',
    channelId: 'UC_vt34wimdCzdkrzVejwX9g',
    uploadsList: 'UU_vt34wimdCzdkrzVejwX9g',
    videos: []
  },

  // BENGALI
  {
    id: 'bd_somoy',
    broadcaster: 'Somoy TV',
    countryCode: 'BD',
    countryName: 'Bangladesh',
    countryNative: 'বাংলাদেশ',
    flag: '🇧🇩',
    region: 'Asia',
    langCode: 'bn',
    langName: 'Bengali',
    langNative: 'বাংলা',
    family: 'Indo-Aryan',
    channelId: 'UCxHoBXkY88Tb8z1Ssj6CWsQ',
    uploadsList: 'UUxHoBXkY88Tb8z1Ssj6CWsQ',
    videos: []
  },

  // JAPANESE
  {
    id: 'jp_ann',
    broadcaster: 'ANNnewsCH (TV Asahi)',
    countryCode: 'JP',
    countryName: 'Japan',
    countryNative: '日本',
    flag: '🇯🇵',
    region: 'Asia',
    langCode: 'ja',
    langName: 'Japanese',
    langNative: '日本語',
    family: 'Japonic',
    channelId: 'UCGCZAYq5Xxojl_tSXcVJhiQ',
    uploadsList: 'UUGCZAYq5Xxojl_tSXcVJhiQ',
    videos: []
  },

  // KOREAN
  {
    id: 'kr_kbs',
    broadcaster: 'KBS News',
    countryCode: 'KR',
    countryName: 'South Korea',
    countryNative: '대한민국',
    flag: '🇰🇷',
    region: 'Asia',
    langCode: 'ko',
    langName: 'Korean',
    langNative: '한국어',
    family: 'Koreanic',
    channelId: 'UCcQTRi69dsVYHN3exePtZ1A',
    uploadsList: 'UUcQTRi69dsVYHN3exePtZ1A',
    videos: []
  },

  // MANDARIN CHINESE
  {
    id: 'tw_pts',
    broadcaster: 'PTS News (公視新聞網)',
    countryCode: 'TW',
    countryName: 'Taiwan',
    countryNative: '臺灣',
    flag: '🇹🇼',
    region: 'Asia',
    langCode: 'zh',
    langName: 'Chinese',
    langNative: '中文',
    family: 'Sino-Tibetan',
    channelId: 'UCexpzYDEnfmAvPSfG4xbcjA',
    uploadsList: 'UUexpzYDEnfmAvPSfG4xbcjA',
    videos: []
  },

  // VIETNAMESE
  {
    id: 'vn_vtv24',
    broadcaster: 'VTV24',
    countryCode: 'VN',
    countryName: 'Vietnam',
    countryNative: 'Việt Nam',
    flag: '🇻🇳',
    region: 'Asia',
    langCode: 'vi',
    langName: 'Vietnamese',
    langNative: 'Tiếng Việt',
    family: 'Austroasiatic',
    channelId: 'UCabsTV34JwALXKGMqHpvUiA',
    uploadsList: 'UUabsTV34JwALXKGMqHpvUiA',
    videos: []
  },

  // THAI
  {
    id: 'th_thaipbs',
    broadcaster: 'Thai PBS News',
    countryCode: 'TH',
    countryName: 'Thailand',
    countryNative: 'ประเทศไทย',
    flag: '🇹🇭',
    region: 'Asia',
    langCode: 'th',
    langName: 'Thai',
    langNative: 'ไทย',
    family: 'Tai-Kadai',
    channelId: 'UC4nodaN0c2bfG9fK3A3_X_w',
    uploadsList: 'UU4nodaN0c2bfG9fK3A3_X_w',
    videos: []
  },

  // INDONESIAN
  {
    id: 'id_kompas',
    broadcaster: 'Kompas TV',
    countryCode: 'ID',
    countryName: 'Indonesia',
    countryNative: 'Indonesia',
    flag: '🇮🇩',
    region: 'Asia',
    langCode: 'id',
    langName: 'Indonesian',
    langNative: 'Bahasa Indonesia',
    family: 'Austronesian',
    channelId: 'UC5BMIWZe9isJXLZZWPWvBlg',
    uploadsList: 'UU5BMIWZe9isJXLZZWPWvBlg',
    videos: []
  },

  // MALAY
  {
    id: 'my_awani',
    broadcaster: 'Astro AWANI',
    countryCode: 'MY',
    countryName: 'Malaysia',
    countryNative: 'Malaysia',
    flag: '🇲🇾',
    region: 'Asia',
    langCode: 'ms',
    langName: 'Malay',
    langNative: 'Bahasa Melayu',
    family: 'Austronesian',
    channelId: 'UC5d3c-6d_0jP5pA9y_m90pA',
    uploadsList: 'UU5d3c-6d_0jP5pA9y_m90pA',
    videos: []
  },

  // TAGALOG
  {
    id: 'ph_gma',
    broadcaster: 'GMA Integrated News',
    countryCode: 'PH',
    countryName: 'Philippines',
    countryNative: 'Pilipinas',
    flag: '🇵🇭',
    region: 'Asia',
    langCode: 'tl',
    langName: 'Tagalog',
    langNative: 'Tagalog',
    family: 'Austronesian',
    channelId: 'UCKL5hAuzgFQsyrsQKgU0Qng',
    uploadsList: 'UUKL5hAuzgFQsyrsQKgU0Qng',
    videos: []
  },

  // SWAHILI
  {
    id: 'ke_citizen',
    broadcaster: 'Citizen TV Kenya',
    countryCode: 'KE',
    countryName: 'Kenya',
    countryNative: 'Kenya',
    flag: '🇰🇪',
    region: 'Africa',
    langCode: 'sw',
    langName: 'Swahili',
    langNative: 'Kiswahili',
    family: 'Niger-Congo',
    channelId: 'UChBQgieUidDMXRWzคันH4_xQ',
    uploadsList: 'UUhBQgieUidDMXRWzคันH4_xQ',
    videos: []
  }
];

/**
 * Country Name Translations for Español and Português
 */
const COUNTRY_TRANSLATIONS = {
  es: {
    ES: 'España', MX: 'México', AR: 'Argentina', CO: 'Colombia', CL: 'Chile',
    GB: 'Reino Unido', US: 'Estados Unidos', AU: 'Australia', CA: 'Canadá',
    BR: 'Brasil', PT: 'Portugal', FR: 'Francia', DE: 'Alemania', AT: 'Austria',
    IT: 'Italia', NL: 'Países Bajos', PL: 'Polonia', RU: 'Rusia', UA: 'Ucrania',
    GR: 'Grecia', RO: 'Rumania', TR: 'Turquía', QA: 'Catar', SA: 'Arabia Saudita',
    IR: 'Irán', IL: 'Israel', IN: 'India', PK: 'Pakistán', BD: 'Bangladés',
    JP: 'Japón', KR: 'Corea del Sur', TW: 'Taiwán', VN: 'Vietnam', TH: 'Tailandia',
    ID: 'Indonesia', MY: 'Malasia', PH: 'Filipinas', KE: 'Kenia'
  },
  pt: {
    ES: 'Espanha', MX: 'México', AR: 'Argentina', CO: 'Colômbia', CL: 'Chile',
    GB: 'Reino Unido', US: 'Estados Unidos', AU: 'Austrália', CA: 'Canadá',
    BR: 'Brasil', PT: 'Portugal', FR: 'França', DE: 'Alemanha', AT: 'Áustria',
    IT: 'Itália', NL: 'Países Baixos', PL: 'Polônia', RU: 'Rússia', UA: 'Ucrânia',
    GR: 'Grécia', RO: 'Romênia', TR: 'Turquia', QA: 'Catar', SA: 'Arábia Saudita',
    IR: 'Irã', IL: 'Israel', IN: 'Índia', PK: 'Paquistão', BD: 'Bangladesh',
    JP: 'Japão', KR: 'Coreia do Sul', TW: 'Taiwan', VN: 'Vietnã', TH: 'Tailândia',
    ID: 'Indonésia', MY: 'Malásia', PH: 'Filipinas', KE: 'Quênia'
  }
};