/**
 * ============================================================================
 * WORLD TV NEWS BROADCASTERS DATABASE (Option 4 Audited Studio Anchor Clips)
 * ============================================================================
 * - All 24/7 live streams, Euronews feeds, and intro-only jingles removed
 * - Every clip uses a studio-anchor opening window (`minStart` / `maxStart`)
 *   so playback begins on the native-language news presenter in the studio
 *   rather than deep inside foreign-language interview soundbites
 */

const TV_NEWS_BROADCASTERS = [
  // SPANISH (Multiple Countries for Country Accent Battles)
  {
    id: 'es_rtve',
    broadcaster: 'RTVE Noticias',
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
    videos: [
      { id: 'BOXpmYYevvs', title: 'Las noticias en 10 minutos | RTVE Noticias', minStart: 12, maxStart: 55 },
      { id: '3VNM-rHdzCk', title: 'Resumen de noticias | RTVE Noticias', minStart: 12, maxStart: 55 },
      { id: 'IlohTwuy8Zo', title: 'Telediario en 10 minutos | RTVE Noticias', minStart: 12, maxStart: 55 },
      { id: 'Bmp6qLp-YnY', title: 'Especial Telediario | RTVE Noticias', minStart: 15, maxStart: 60 }
    ]
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
    videos: [
      { id: '4WgCyxZcCrw', title: 'En Punto | Noticiero NMás México', minStart: 15, maxStart: 60 },
      { id: 'opM5tr_TJb8', title: 'Despierta | Noticiero NMás México', minStart: 15, maxStart: 60 },
      { id: '6_lbZTw8Urg', title: 'En Punto con Enrique Acevedo | NMás México', minStart: 15, maxStart: 60 },
      { id: '7HJmM0EHAz8', title: 'Noticiero En Punto | NMás México', minStart: 10, maxStart: 45 }
    ]
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
    videos: [
      { id: 'GA7PmiYkQZQ', title: 'Cobertura Especial | Todo Noticias TN Argentina', minStart: 12, maxStart: 55 },
      { id: 'ColdJnWCmqE', title: 'Informe y Análisis | Todo Noticias TN Argentina', minStart: 12, maxStart: 55 },
      { id: 'tGhu0IYl_X0', title: 'Crónica Nacional | Todo Noticias TN Argentina', minStart: 8, maxStart: 40 },
      { id: 'Y8y4B9llrBc', title: 'Informe Paraná | Todo Noticias TN Argentina', minStart: 6, maxStart: 28 }
    ]
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
    videos: [
      { id: 'VsD43VcvLpA', title: 'Noticias Caracol | Emisión Central Colombia', minStart: 12, maxStart: 55 },
      { id: 'oCbTZ_X0gzk', title: 'Noticias Caracol | Edición Central', minStart: 12, maxStart: 55 },
      { id: 'gm3CWsZ70OM', title: 'Noticias Caracol | Resumen Informativo', minStart: 12, maxStart: 55 },
      { id: 'kPXnk8pXWto', title: 'Noticias Caracol | Reportaje Central', minStart: 10, maxStart: 50 }
    ]
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
    videos: [
      { id: '0yBGZtjq9ZM', title: 'Reportajes Teletrece T13 Chile', minStart: 12, maxStart: 55 },
      { id: 'o15jRo4LkBA', title: 'Edición Central | Reportajes T13 Chile', minStart: 12, maxStart: 55 },
      { id: 'sHp3dPzRfj4', title: 'Investigación Teletrece | T13 Chile', minStart: 12, maxStart: 55 },
      { id: 'a0VyMaZcAKM', title: 'Crónicas y Reportajes | Teletrece Chile', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'o8K3cVKbboY', title: 'Sky News UK | World & National Report', minStart: 10, maxStart: 50 },
      { id: 'WOmLXy9Hy7E', title: 'Sky News UK | International Analysis', minStart: 10, maxStart: 50 },
      { id: 'WtfnqMVqJrg', title: 'Sky News Bulletin | United Kingdom', minStart: 10, maxStart: 50 },
      { id: 'P-mXmigU7pw', title: 'UK National News Report | British Broadcast', minStart: 10, maxStart: 50 }
    ]
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
    videos: [
      { id: 'r2E6knuBNdk', title: 'PBS NewsHour Full Episode | US Broadcast', minStart: 15, maxStart: 60 },
      { id: '2jGv-4tg9x8', title: 'PBS NewsHour Evening Edition', minStart: 15, maxStart: 60 },
      { id: 'arz_Kb2y6XQ', title: 'PBS NewsHour National Report', minStart: 15, maxStart: 60 },
      { id: 'oIOGidhzwmQ', title: 'PBS NewsHour | Washington Studio', minStart: 15, maxStart: 60 }
    ]
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
    videos: [
      { id: 'ns-CyLzlecE', title: 'The Business | ABC News Australia', minStart: 10, maxStart: 50 },
      { id: 'JhxynVecpyk', title: 'National Report | ABC News Australia', minStart: 10, maxStart: 50 },
      { id: 'etBtIEAgNlM', title: 'Australian Economy & Retail | ABC News', minStart: 10, maxStart: 45 },
      { id: 'EdgUyNF0rU0', title: 'Sydney Local Report | ABC News Australia', minStart: 8, maxStart: 35 }
    ]
  },
  {
    id: 'ca_cbc',
    broadcaster: 'CBC News: The National',
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
    videos: [
      { id: '67AH4_-TOQg', title: 'Power & Politics | CBC News Canada', minStart: 10, maxStart: 55 },
      { id: 'CIj1a62kKJA', title: 'Canadian National Report | CBC News', minStart: 12, maxStart: 55 },
      { id: 'VS_6HmDTKq4', title: 'CBC News: The National | Ottawa & Trade', minStart: 10, maxStart: 45 },
      { id: 'eizd_jOx3bE', title: 'CBC News: The National | Canadian Aviation', minStart: 8, maxStart: 30 }
    ]
  },

  // PORTUGUESE (Brazil & Portugal — Domestic Studio Reports Only, No Euronews)
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
    videos: [
      { id: 'I0w7PDkoc7M', title: 'Íntegra do Jornal da Record | Brasil', minStart: 15, maxStart: 60 },
      { id: 'QoiKpYs1oQc', title: 'Jornal da Record Edição Completa', minStart: 15, maxStart: 60 },
      { id: 'X7rxEBOBwE0', title: 'Jornal da Record | Edição Principal', minStart: 15, maxStart: 60 },
      { id: 'lbscDjp-FPc', title: 'Jornal da Record News | Brasil', minStart: 15, maxStart: 60 }
    ]
  },
  {
    id: 'pt_rtp',
    broadcaster: 'SIC / RTP Notícias Portugal',
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
    videos: [
      { id: 'Blm5EPJkrG8', title: 'Notícias Portugal | Reportagem Nacional', minStart: 10, maxStart: 50 },
      { id: 'HUG7UnWpads', title: 'Grande Reportagem SIC Notícias | Portugal', minStart: 15, maxStart: 60 },
      { id: 'BGNeY3GFIMc', title: 'Habitação e Economia em Portugal | Notícias', minStart: 12, maxStart: 55 },
      { id: 'K8SzceryHgo', title: 'Investigação SIC Notícias | Lisboa Portugal', minStart: 12, maxStart: 55 }
    ]
  },

  // FRENCH
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
    videos: [
      { id: '3g-OcGFdZhA', title: 'Journal d’actualité internationale • FRANCE 24', minStart: 10, maxStart: 50 },
      { id: 'G12OgsCFlrc', title: 'Reportage Europe & Monde • FRANCE 24', minStart: 10, maxStart: 50 },
      { id: '7PuxhJVtVG8', title: 'Édition Spéciale • FRANCE 24 Français', minStart: 12, maxStart: 55 },
      { id: '8V4u66cPEkI', title: 'Le Journal • FRANCE 24', minStart: 12, maxStart: 55 }
    ]
  },

  // GERMAN (Germany & Austria/DW)
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
    videos: [
      { id: 'QcvyHKYAc8g', title: 'tagesschau 20:00 Uhr | ARD Das Erste', minStart: 12, maxStart: 55 },
      { id: 'UbFjPWhqWEI', title: 'tagesschau 20:00 Uhr Hauptausgabe | ARD', minStart: 12, maxStart: 55 },
      { id: 'QwGuhdnFPyo', title: 'tagesschau 20:00 Uhr Nachrichten | ARD', minStart: 12, maxStart: 55 },
      { id: 'Y0HLo90yijY', title: 'tagesschau 20:00 Uhr | ARD Deutschland', minStart: 12, maxStart: 55 }
    ]
  },
  {
    id: 'de_dw',
    broadcaster: 'DW Nachrichten',
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
    videos: [
      { id: 'y7298LXSAHg', title: 'Europa Aktuell | DW Nachrichten', minStart: 10, maxStart: 50 },
      { id: 'mDhLX2_hKFU', title: 'Wirtschaft & Welt | DW Deutsch', minStart: 10, maxStart: 50 },
      { id: 'SoKNOO369Lc', title: 'Weltspiegel Reportage | Deutsch', minStart: 10, maxStart: 50 },
      { id: 'xCSLNbVaUJE', title: 'DW Nachrichten Journal', minStart: 10, maxStart: 45 }
    ]
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
    videos: [
      { id: '3Lu1xgIMtYY', title: 'TG La7 Telegiornale Edizione 13:30 | Italia', minStart: 12, maxStart: 55 },
      { id: 'zWmVr_Cv0DA', title: 'TG La7 Telegiornale Giorno', minStart: 12, maxStart: 55 },
      { id: 'OhtH06KDVDA', title: 'TG La7 Edizione delle ore 20:00', minStart: 12, maxStart: 55 },
      { id: 'zswRryBMqIY', title: 'TG La7 Telegiornale Sera | Enrico Mentana', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'GFuhUIo4NgA', title: 'NOS Journaal | Nieuws uit Nederland', minStart: 10, maxStart: 50 },
      { id: '03wqs0OIaFU', title: 'NOS Journaal Uitzending | Nederland', minStart: 10, maxStart: 50 },
      { id: 'qTC9LDveJ0Q', title: 'NOS Journaal | Avondnieuws met Annechien Steenhuizen', minStart: 8, maxStart: 40 },
      { id: 'hXNdZOSpEIE', title: 'NOS Journaal Verslag | Nederlands Nieuws', minStart: 5, maxStart: 20 }
    ]
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
    videos: [
      { id: 'mn3WN5zJw_k', title: 'Wydarzenia | Polsat News Polska', minStart: 10, maxStart: 50 },
      { id: 'xtlwBZq9ZTE', title: 'Debata i Wiadomości | Polsat News', minStart: 12, maxStart: 55 },
      { id: 'GxDOACpKADk', title: 'Punkt Widzenia | Polsat News', minStart: 12, maxStart: 55 },
      { id: '-9wJ0Ek0SUQ', title: 'Wiadomości Dnia | Polsat News', minStart: 8, maxStart: 35 }
    ]
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
    videos: [
      { id: 'wf4e7FW4rHo', title: 'Новости Утро | Настоящее Время', minStart: 12, maxStart: 55 },
      { id: 'RVd9HLzwFBk', title: 'Информационный выпуск | Настоящее Время', minStart: 12, maxStart: 55 },
      { id: 'u7WRTZcCA3o', title: 'Главное: Новости дня | Настоящее Время', minStart: 12, maxStart: 55 },
      { id: 'PH_G_31cbII', title: 'Вечерний выпуск новостей | Настоящее Время', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'QiTPGE_b_7w', title: 'ТСН Новини | Випуск новин України', minStart: 12, maxStart: 55 },
      { id: 'JWEtusVOsc4', title: 'ТСН Ранок | Головні новини України', minStart: 12, maxStart: 55 },
      { id: '-bw1M3TzUwU', title: 'ТСН Тиждень | Вечірній випуск', minStart: 12, maxStart: 55 },
      { id: 'BD4yH0V5rLM', title: 'ТСН Спецвипуск | Україна', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'SE4sOJmminI', title: 'Δελτίο Ειδήσεων | ΕΡΤ News Ελλάδα', minStart: 8, maxStart: 38 },
      { id: 'rEf6eF6LHzM', title: 'Κεντρικό Δελτίο Ειδήσεων | ΕΡΤnews', minStart: 3, maxStart: 12 },
      { id: 'tkjVfd5eBcU', title: 'Ειδήσεις ΕΡΤnews | Αθήνα', minStart: 2, maxStart: 10 }
    ]
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
    videos: [
      { id: 'auvHMw2ERtw', title: 'Știrile Digi24 | Jurnal de Știri România', minStart: 12, maxStart: 55 },
      { id: 'OmnHNyH_5PQ', title: 'Știrile Digi24 de la ora 16 | România', minStart: 12, maxStart: 55 },
      { id: 'gJ-E9lZJySM', title: 'Jurnalul Digi24 HD | București', minStart: 12, maxStart: 55 },
      { id: 'JdPQv1-vheo', title: 'Jurnalul de seară | Digi24 România', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'ym3Xlxbxuv8', title: 'Gündem Özel | TRT Haber Türkiye', minStart: 8, maxStart: 35 },
      { id: 'DY5BBiVtWT4', title: 'TRT Haber Bülteni | Türkiye', minStart: 8, maxStart: 38 },
      { id: 'XUU33xdaGiw', title: 'TRT Haber Özel Yayın | Ankara', minStart: 10, maxStart: 50 },
      { id: 'V_I143kLwkE', title: 'TRT Haberler Bülteni | Türkiye', minStart: 12, maxStart: 55 }
    ]
  },

  // ARABIC (Qatar & Saudi Arabia/Pan-Arab)
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
    videos: [
      { id: 'ZBbJHQ9BjnE', title: 'نشرة الأخبار وبرنامج شبكات | قناة الجزيرة', minStart: 10, maxStart: 50 },
      { id: '0Baax2rfg3Q', title: 'تقرير إخباري مفصل | قناة الجزيرة قطر', minStart: 10, maxStart: 50 },
      { id: 'J6kR0EpHwoU', title: 'الأخبار العاجلة | قناة الجزيرة', minStart: 4, maxStart: 16 }
    ]
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
    videos: [
      { id: '7VwbLc-6dDQ', title: 'نشرة إخبارية مفصلة | قناة العربية', minStart: 12, maxStart: 55 },
      { id: 'zxX4Op3qt6I', title: 'نشرة الأخبار الرئيسية | العربية', minStart: 12, maxStart: 55 },
      { id: '0DaVO9NiYtY', title: 'التغطية الإخبارية | قناة العربية', minStart: 12, maxStart: 55 },
      { id: '6oI292di8TM', title: 'النشرة الصباحية | قناة العربية', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'sHlsz4MGTF4', title: 'اخبار ساعت شش عصر | BBC Persian', minStart: 12, maxStart: 55 },
      { id: 'd349gnVKMVY', title: 'مجله خبری تلویزیون بی‌بی‌سی فارسی', minStart: 12, maxStart: 55 },
      { id: 'q1e41uwU_bE', title: 'خبرهای روز ایران و جهان | BBC Persian', minStart: 12, maxStart: 55 },
      { id: 'BAJZzsDhRHI', title: 'اخبار شامگاهی بی‌بی‌سی فارسی', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'iMiISoH1B_E', title: 'חדשות הערב | כאן 11 תאגיד השידור הישראלי', minStart: 10, maxStart: 50 },
      { id: 'GzeTg5vTCe8', title: 'מהדורת חדשות מרכזית | כאן 11', minStart: 12, maxStart: 55 },
      { id: '8oqyj4yaNa8', title: 'כתבת חדשות | כאן 11 ישראל', minStart: 10, maxStart: 50 },
      { id: 'Yz06SbTunD0', title: 'חדשות הלילה | כאן חדשות', minStart: 10, maxStart: 50 }
    ]
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
    videos: [
      { id: 'FGFv60DjSww', title: 'आज के मुख्य समाचार | Hindi News Bulletin India', minStart: 12, maxStart: 55 },
      { id: '27b7gOV4EOI', title: 'NDTV India | मुख्य समाचार रिपोर्ट', minStart: 4, maxStart: 14 },
      { id: 'sBKy2GmBJZ8', title: 'NDTV India | बड़ी खबर और विश्लेषण', minStart: 4, maxStart: 16 }
    ]
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
    videos: [
      { id: 'hIqqMYLGhOo', title: 'Geo News Headlines & Bulletin | Pakistan', minStart: 12, maxStart: 55 },
      { id: '1tqW0jMvch8', title: 'Geo News 5PM Headlines | Urdu Bulletin', minStart: 12, maxStart: 55 },
      { id: 'xpkL7nV32cE', title: 'Geo News Primetime Bulletin | Pakistan', minStart: 12, maxStart: 55 },
      { id: 'TQaiGMzcRSg', title: 'Geo News 10PM Headlines | Urdu', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'SvR22H_7Kj0', title: 'সময় সংবাদ | Somoy TV News Bulletin Bangladesh', minStart: 12, maxStart: 55 },
      { id: 'fwK5B67KQ1c', title: 'আন্তর্জাতিক সময় | Somoy TV Bangla News', minStart: 12, maxStart: 55 },
      { id: 'vvpwQ4ETqgo', title: 'দুপুরের সময় | Somoy TV Bulletin', minStart: 12, maxStart: 55 },
      { id: '2cFTlHu8afU', title: 'বিভাগীয় সময় | Somoy TV Bangladesh', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'ZslEMbiLVmI', title: 'スーパーJチャンネル ニュース報道 | ANNnewsCH', minStart: 10, maxStart: 50 },
      { id: '2Q35YaF6ZGw', title: 'ANNニュース 特集報道 | テレビ朝日', minStart: 10, maxStart: 50 },
      { id: 'ZDwp_DhHD7g', title: 'スーパーJチャンネル 国際・国内ニュース | ANN', minStart: 10, maxStart: 50 },
      { id: '2OUGOJ9BY_A', title: 'ANN定時ニュース | 日本', minStart: 4, maxStart: 16 }
    ]
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
    videos: [
      { id: 'Saa51gREgP8', title: 'KBS 뉴스특보 및 주요뉴스 | 한국', minStart: 10, maxStart: 50 },
      { id: '5nA7ceq7rgM', title: 'KBS 뉴스 9 주요보도 | 대한민국', minStart: 8, maxStart: 38 },
      { id: 'ET0PX_5CTlI', title: 'KBS 뉴스 리포트 | 한국어 방송', minStart: 8, maxStart: 38 },
      { id: 'uL1UPea5eIk', title: 'KBS 뉴스 속보 리포트', minStart: 5, maxStart: 20 }
    ]
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
    videos: [
      { id: '8hpB1KF2A9A', title: '公視晚間新聞 完整版 | PTS News Taiwan', minStart: 15, maxStart: 60 },
      { id: '7ek_EBgV32I', title: '公視早安新聞 完整版 | PTS News', minStart: 15, maxStart: 60 },
      { id: 'lETp3pfo13I', title: '8點新世界 國際新聞 | 公視新聞網', minStart: 15, maxStart: 60 },
      { id: 'KB2b_8hSMdQ', title: '公視午間新聞 完整版 | 台灣', minStart: 15, maxStart: 60 }
    ]
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
    videos: [
      { id: 'S4DHyVg6oo4', title: 'Thời sự toàn cảnh trưa | VTV24 Việt Nam', minStart: 12, maxStart: 55 },
      { id: 'd14e_1d_as4', title: 'Thời sự toàn cảnh tối | VTV24', minStart: 12, maxStart: 55 },
      { id: 'll40lz5f6N4', title: 'Thế giới toàn cảnh | Bản tin VTV24', minStart: 12, maxStart: 55 },
      { id: 'HCuAQLg5Bss', title: 'Bản tin Thời sự VTV24 | Việt Nam', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'kA2xwuJ0yFk', title: 'ข่าวค่ำ Thai PBS | รายงานข่าวประเทศไทย', minStart: 12, maxStart: 55 },
      { id: 'zu-IU6gK_z0', title: 'ข่าวค่ำ ฉบับเต็ม | Thai PBS News', minStart: 15, maxStart: 60 },
      { id: 'US-43dAn-VM', title: 'รายการข่าวค่ำ | Thai PBS ประเทศไทย', minStart: 15, maxStart: 60 },
      { id: 'J-vAfy2W9Eo', title: 'วิเคราะห์ข่าวเศรษฐกิจและโลก | Thai PBS', minStart: 12, maxStart: 55 }
    ]
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
    videos: [
      { id: 'xiJPaBcbjLE', title: 'Kompas Petang | Berita Utama Kompas TV Indonesia', minStart: 12, maxStart: 55 },
      { id: '61Lvs90OnYc', title: 'Laporan Khusus | Kompas TV Indonesia', minStart: 12, maxStart: 55 },
      { id: 'CR-CBMnxxU0', title: 'Berita Nasional | Kompas TV', minStart: 12, maxStart: 55 },
      { id: 'KJ3R0FOkRsU', title: 'Breaking News | Kompas TV Jakarta', minStart: 10, maxStart: 45 }
    ]
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
    videos: [
      { id: 'DUL8OcsiGro', title: 'Buletin Utama | Berita Nasional Malaysia', minStart: 15, maxStart: 60 },
      { id: 'DFz_ObXq0DQ', title: 'Buletin AWANI Khas | Astro AWANI Malaysia', minStart: 15, maxStart: 60 },
      { id: 'OfzUNqeBvUQ', title: 'Laporan Berita | Astro AWANI Malaysia', minStart: 10, maxStart: 50 },
      { id: 'tdk4f2KTFVo', title: 'Berita Semasa | Astro AWANI Malaysia', minStart: 8, maxStart: 40 }
    ]
  },

  // TAGALOG
  {
    id: 'ph_gma',
    broadcaster: 'GMA Integrated News (24 Oras)',
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
    videos: [
      { id: 'irIE3JoW1EY', title: '24 Oras Express | GMA Integrated News Philippines', minStart: 15, maxStart: 60 },
      { id: 'Wnj3mLPrAMI', title: '24 Oras Full Broadcast | GMA News Pilipinas', minStart: 15, maxStart: 60 },
      { id: 'nzR4KC380gk', title: '24 Oras | Balitang Pambansa GMA News', minStart: 15, maxStart: 60 },
      { id: 'OHWHg8ta4k0', title: '24 Oras Primetime | GMA Integrated News', minStart: 15, maxStart: 60 }
    ]
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
    channelId: 'UChBQgieUidDMXRWz4H4_xQ',
    videos: [
      { id: 'GFjZke-hRnM', title: 'Citizen Nipashe Wikendi | Habari za Kiswahili Kenya', minStart: 15, maxStart: 60 },
      { id: 'mk1DMW0v3BA', title: 'Citizen Nipashe | Taarifa ya Habari Kenya', minStart: 15, maxStart: 60 },
      { id: 'uvSjwDIlFNA', title: 'Nipashe | Citizen TV Kenya', minStart: 15, maxStart: 60 }
    ]
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
