/**
 * ============================================================================
 * WORLD TV NEWS BROADCASTERS DATABASE (Option A/B Hybrid)
 * ============================================================================
 * Maps national TV news broadcasters to their exact Country, Language,
 * verified YouTube Channel ID, and curated multi-minute broadcast video IDs
 * so `loadVideoById()` works immediately without Error 153 or playlist desyncs.
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
      { id: 'BOXpmYYevvs', title: 'Las noticias en 10 minutos | RTVE Noticias', maxStart: 180 },
      { id: '3VNM-rHdzCk', title: 'Resumen de noticias | RTVE Noticias', maxStart: 180 },
      { id: 'IlohTwuy8Zo', title: 'Telediario en 10 minutos | RTVE Noticias', maxStart: 180 },
      { id: 'Bmp6qLp-YnY', title: 'Especial Telediario | RTVE Noticias', maxStart: 200 }
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
      { id: '4WgCyxZcCrw', title: 'En Punto | Noticiero NMás México', maxStart: 240 },
      { id: 'opM5tr_TJb8', title: 'Despierta | Noticiero NMás México', maxStart: 240 },
      { id: 'p2AzyIEuFak', title: 'N+ FORO Noticias México', maxStart: 60 }
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
      { id: 'GA7PmiYkQZQ', title: 'Cobertura Especial | Todo Noticias TN Argentina', maxStart: 240 },
      { id: 'cxNWhQ8FiH4', title: 'Informe Meteorológico | Todo Noticias TN', maxStart: 15 },
      { id: 'cb12KmMMDJA', title: 'Transmisión Todo Noticias TN Argentina', maxStart: 45 }
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
      { id: 'VsD43VcvLpA', title: 'Noticias Caracol | Emisión Central Colombia', maxStart: 240 },
      { id: 'oCbTZ_X0gzk', title: 'Noticias Caracol | Edición Central', maxStart: 200 },
      { id: 'gm3CWsZ70OM', title: 'Noticias Caracol | Resumen Informativo', maxStart: 180 },
      { id: 'kPXnk8pXWto', title: 'Noticias Caracol | Reportaje Central', maxStart: 120 }
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
      { id: '0yBGZtjq9ZM', title: 'Reportajes Teletrece T13 Chile', maxStart: 160 },
      { id: 'o15jRo4LkBA', title: 'Edición Central | Reportajes T13 Chile', maxStart: 180 },
      { id: 'sHp3dPzRfj4', title: 'Investigación Teletrece | T13 Chile', maxStart: 160 },
      { id: 'a0VyMaZcAKM', title: 'Crónicas y Reportajes | Teletrece Chile', maxStart: 180 }
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
      { id: 'o8K3cVKbboY', title: 'Sky News UK | World & National Report', maxStart: 120 },
      { id: 'WOmLXy9Hy7E', title: 'Sky News UK | International Analysis', maxStart: 180 },
      { id: 'WtfnqMVqJrg', title: 'Sky News Bulletin | United Kingdom', maxStart: 180 },
      { id: 'P-mXmigU7pw', title: 'UK National News Report | British Broadcast', maxStart: 180 }
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
      { id: 'r2E6knuBNdk', title: 'PBS NewsHour Full Episode | US Broadcast', maxStart: 300 },
      { id: '2jGv-4tg9x8', title: 'PBS NewsHour Evening Edition', maxStart: 300 },
      { id: 'arz_Kb2y6XQ', title: 'PBS NewsHour National Report', maxStart: 300 },
      { id: 'oIOGidhzwmQ', title: 'PBS NewsHour | Washington Studio', maxStart: 300 }
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
      { id: 'ns-CyLzlecE', title: 'The Business | ABC News Australia', maxStart: 110 },
      { id: 'JhxynVecpyk', title: 'National Report | ABC News Australia', maxStart: 100 },
      { id: 'etBtIEAgNlM', title: 'Australian Economy & Retail | ABC News', maxStart: 90 },
      { id: 'EdgUyNF0rU0', title: 'Sydney Local Report | ABC News Australia', maxStart: 45 }
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
      { id: '67AH4_-TOQg', title: 'Power & Politics | CBC News Canada', maxStart: 180 },
      { id: 'CIj1a62kKJA', title: 'Canadian National Report | CBC News', maxStart: 240 },
      { id: 'VS_6HmDTKq4', title: 'CBC News: The National | Ottawa & Trade', maxStart: 60 },
      { id: 'eizd_jOx3bE', title: 'CBC News: The National | Canadian Aviation', maxStart: 35 }
    ]
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
    videos: [
      { id: 'I0w7PDkoc7M', title: 'Íntegra do Jornal da Record | Brasil', maxStart: 300 },
      { id: 'QoiKpYs1oQc', title: 'Jornal da Record Edição Completa', maxStart: 300 },
      { id: 'X7rxEBOBwE0', title: 'Jornal da Record | Edição Principal', maxStart: 300 },
      { id: 'lbscDjp-FPc', title: 'Jornal da Record News | Brasil', maxStart: 300 }
    ]
  },
  {
    id: 'pt_rtp',
    broadcaster: 'RTP / Notícias Portugal',
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
      { id: 'Blm5EPJkrG8', title: 'Notícias Portugal | Reportagem Nacional', maxStart: 120 },
      { id: 'zRlVHXW4WNU', title: 'RTP Notícias | Edição da Noite Portugal', maxStart: 30 },
      { id: '6UJQV9I7l0Q', title: 'RTP 1 Telejornal | Lisboa Portugal', maxStart: 30 },
      { id: 'XuZAl-ZPEcA', title: 'Euronews em Português | Direto', maxStart: 45 }
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
      { id: '3g-OcGFdZhA', title: 'Journal d’actualité internationale • FRANCE 24', maxStart: 120 },
      { id: 'G12OgsCFlrc', title: 'Reportage Europe & Monde • FRANCE 24', maxStart: 140 },
      { id: '7PuxhJVtVG8', title: 'Édition Spéciale • FRANCE 24 Français', maxStart: 180 },
      { id: '8V4u66cPEkI', title: 'Le Journal • FRANCE 24', maxStart: 200 }
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
      { id: 'QcvyHKYAc8g', title: 'tagesschau 20:00 Uhr | ARD Das Erste', maxStart: 240 },
      { id: 'UbFjPWhqWEI', title: 'tagesschau 20:00 Uhr Hauptausgabe | ARD', maxStart: 240 },
      { id: 'QwGuhdnFPyo', title: 'tagesschau 20:00 Uhr Nachrichten | ARD', maxStart: 240 },
      { id: 'Y0HLo90yijY', title: 'tagesschau 20:00 Uhr | ARD Deutschland', maxStart: 240 }
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
      { id: 'y7298LXSAHg', title: 'Europa Aktuell | DW Nachrichten', maxStart: 200 },
      { id: 'mDhLX2_hKFU', title: 'Wirtschaft & Welt | DW Deutsch', maxStart: 200 },
      { id: 'SoKNOO369Lc', title: 'Weltspiegel Reportage | Deutsch', maxStart: 200 },
      { id: 'xCSLNbVaUJE', title: 'DW Nachrichten Journal', maxStart: 90 }
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
      { id: '3Lu1xgIMtYY', title: 'TG La7 Telegiornale Edizione 13:30 | Italia', maxStart: 240 },
      { id: 'zWmVr_Cv0DA', title: 'TG La7 Telegiornale Giorno', maxStart: 240 },
      { id: 'OhtH06KDVDA', title: 'TG La7 Edizione delle ore 20:00', maxStart: 240 },
      { id: 'zswRryBMqIY', title: 'TG La7 Telegiornale Sera | Enrico Mentana', maxStart: 240 }
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
      { id: 'GFuhUIo4NgA', title: 'NOS Journaal | Nieuws uit Nederland', maxStart: 180 },
      { id: '03wqs0OIaFU', title: 'NOS Journaal Uitzending | Nederland', maxStart: 180 },
      { id: 'qTC9LDveJ0Q', title: 'NOS Journaal | Avondnieuws met Annechien Steenhuizen', maxStart: 45 },
      { id: 'hXNdZOSpEIE', title: 'NOS Journaal Verslag | Nederlands Nieuws', maxStart: 20 }
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
      { id: 'mn3WN5zJw_k', title: 'Wydarzenia | Polsat News Polska', maxStart: 120 },
      { id: 'xtlwBZq9ZTE', title: 'Debata i Wiadomości | Polsat News', maxStart: 240 },
      { id: 'GxDOACpKADk', title: 'Punkt Widzenia | Polsat News', maxStart: 240 },
      { id: '-9wJ0Ek0SUQ', title: 'Wiadomości Dnia | Polsat News', maxStart: 40 }
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
      { id: 'wf4e7FW4rHo', title: 'Новости Утро | Настоящее Время', maxStart: 240 },
      { id: 'RVd9HLzwFBk', title: 'Информационный выпуск | Настоящее Время', maxStart: 240 },
      { id: 'u7WRTZcCA3o', title: 'Главное: Новости дня | Настоящее Время', maxStart: 240 },
      { id: 'PH_G_31cbII', title: 'Вечерний выпуск новостей | Настоящее Время', maxStart: 240 }
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
      { id: 'QiTPGE_b_7w', title: 'ТСН Новини | Випуск новин України', maxStart: 200 },
      { id: 'JWEtusVOsc4', title: 'ТСН Ранок | Головні новини України', maxStart: 240 },
      { id: '-bw1M3TzUwU', title: 'ТСН Тиждень | Вечірній випуск', maxStart: 240 },
      { id: 'BD4yH0V5rLM', title: 'ТСН Спецвипуск | Україна', maxStart: 240 }
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
      { id: 'SE4sOJmminI', title: 'Δελτίο Ειδήσεων | ΕΡΤ News Ελλάδα', maxStart: 40 },
      { id: 'rEf6eF6LHzM', title: 'Κεντρικό Δελτίο Ειδήσεων | ΕΡΤnews', maxStart: 10 },
      { id: 'tkjVfd5eBcU', title: 'Ειδήσεις ΕΡΤnews | Αθήνα', maxStart: 8 }
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
      { id: 'auvHMw2ERtw', title: 'Știrile Digi24 | Jurnal de Știri România', maxStart: 240 },
      { id: 'OmnHNyH_5PQ', title: 'Știrile Digi24 de la ora 16 | România', maxStart: 240 },
      { id: 'gJ-E9lZJySM', title: 'Jurnalul Digi24 HD | București', maxStart: 240 },
      { id: 'JdPQv1-vheo', title: 'Jurnalul de seară | Digi24 România', maxStart: 240 }
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
      { id: 'ym3Xlxbxuv8', title: 'Gündem Özel | TRT Haber Türkiye', maxStart: 35 },
      { id: 'DY5BBiVtWT4', title: 'TRT Haber Bülteni | Türkiye', maxStart: 40 },
      { id: 'XUU33xdaGiw', title: 'TRT Haber Özel Yayın', maxStart: 90 },
      { id: 'SiB4y9mXhHI', title: 'TRT Haber Canlı Yayın', maxStart: 30 }
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
      { id: 'ZBbJHQ9BjnE', title: 'نشرة الأخبار وبرنامج شبكات | قناة الجزيرة', maxStart: 90 },
      { id: '0Baax2rfg3Q', title: 'تقرير إخباري مفصل | قناة الجزيرة قطر', maxStart: 75 },
      { id: 'J6kR0EpHwoU', title: 'الأخبار العاجلة | قناة الجزيرة', maxStart: 15 }
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
      { id: '7VwbLc-6dDQ', title: 'نشرة إخبارية مفصلة | قناة العربية', maxStart: 240 },
      { id: 'zxX4Op3qt6I', title: 'نشرة الأخبار الرئيسية | العربية', maxStart: 240 },
      { id: '0DaVO9NiYtY', title: 'التغطية الإخبارية | قناة العربية', maxStart: 240 },
      { id: '6oI292di8TM', title: 'النشرة الصباحية | قناة العربية', maxStart: 180 }
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
      { id: 'sHlsz4MGTF4', title: 'اخبار ساعت شش عصر | BBC Persian', maxStart: 240 },
      { id: 'd349gnVKMVY', title: 'مجله خبری تلویزیون بی‌بی‌سی فارسی', maxStart: 240 },
      { id: 'q1e41uwU_bE', title: 'خبرهای روز ایران و جهان | BBC Persian', maxStart: 240 },
      { id: 'BAJZzsDhRHI', title: 'اخبار شامگاهی بی‌بی‌سی فارسی', maxStart: 240 }
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
      { id: 'iMiISoH1B_E', title: 'חדשות הערב | כאן 11 תאגיד השידור הישראלי', maxStart: 100 },
      { id: 'GzeTg5vTCe8', title: 'מהדורת חדשות מרכזית | כאן 11', maxStart: 180 },
      { id: '8oqyj4yaNa8', title: 'כתבת חדשות | כאן 11 ישראל', maxStart: 90 },
      { id: 'Yz06SbTunD0', title: 'חדשות הלילה | כאן חדשות', maxStart: 80 }
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
      { id: 'FGFv60DjSww', title: 'आज के मुख्य समाचार | Hindi News Bulletin India', maxStart: 240 },
      { id: '27b7gOV4EOI', title: 'NDTV India | मुख्य समाचार रिपोर्ट', maxStart: 12 },
      { id: 'sBKy2GmBJZ8', title: 'NDTV India | बड़ी खबर और विश्लेषण', maxStart: 15 }
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
      { id: 'hIqqMYLGhOo', title: 'Geo News Headlines & Bulletin | Pakistan', maxStart: 240 },
      { id: '1tqW0jMvch8', title: 'Geo News 5PM Headlines | Urdu Bulletin', maxStart: 180 },
      { id: 'xpkL7nV32cE', title: 'Geo News Primetime Bulletin | Pakistan', maxStart: 240 },
      { id: 'TQaiGMzcRSg', title: 'Geo News 10PM Headlines | Urdu', maxStart: 240 }
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
      { id: 'SvR22H_7Kj0', title: 'সময় সংবাদ | Somoy TV News Bulletin Bangladesh', maxStart: 240 },
      { id: 'fwK5B67KQ1c', title: 'আন্তর্জাতিক সময় | Somoy TV Bangla News', maxStart: 240 },
      { id: 'vvpwQ4ETqgo', title: 'দুপুরের সময় | Somoy TV Bulletin', maxStart: 240 },
      { id: '2cFTlHu8afU', title: 'বিভাগীয় সময় | Somoy TV Bangladesh', maxStart: 240 }
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
      { id: 'ZslEMbiLVmI', title: 'スーパーJチャンネル ニュース報道 | ANNnewsCH', maxStart: 140 },
      { id: '2Q35YaF6ZGw', title: 'ANNニュース 特集報道 | テレビ朝日', maxStart: 100 },
      { id: 'ZDwp_DhHD7g', title: 'スーパーJチャンネル 国際・国内ニュース | ANN', maxStart: 120 },
      { id: '2OUGOJ9BY_A', title: 'ANN定時ニュース | 日本', maxStart: 15 }
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
      { id: 'Saa51gREgP8', title: 'KBS 뉴스특보 및 주요뉴스 | 한국', maxStart: 200 },
      { id: '5nA7ceq7rgM', title: 'KBS 뉴스 9 주요보도 | 대한민국', maxStart: 40 },
      { id: 'ET0PX_5CTlI', title: 'KBS 뉴스 리포트 | 한국어 방송', maxStart: 40 },
      { id: 'uL1UPea5eIk', title: 'KBS 뉴스 속보 리포트', maxStart: 20 }
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
      { id: '8hpB1KF2A9A', title: '公視晚間新聞 完整版 | PTS News Taiwan', maxStart: 300 },
      { id: '7ek_EBgV32I', title: '公視早安新聞 完整版 | PTS News', maxStart: 300 },
      { id: 'lETp3pfo13I', title: '8點新世界 國際新聞 | 公視新聞網', maxStart: 240 },
      { id: 'KB2b_8hSMdQ', title: '公視午間新聞 完整版 | 台灣', maxStart: 300 }
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
      { id: 'S4DHyVg6oo4', title: 'Thời sự toàn cảnh trưa | VTV24 Việt Nam', maxStart: 240 },
      { id: 'd14e_1d_as4', title: 'Thời sự toàn cảnh tối | VTV24', maxStart: 240 },
      { id: 'll40lz5f6N4', title: 'Thế giới toàn cảnh | Bản tin VTV24', maxStart: 240 },
      { id: 'HCuAQLg5Bss', title: 'Bản tin Thời sự VTV24 | Việt Nam', maxStart: 240 }
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
      { id: 'kA2xwuJ0yFk', title: 'ข่าวค่ำ Thai PBS | รายงานข่าวประเทศไทย', maxStart: 240 },
      { id: 'zu-IU6gK_z0', title: 'ข่าวค่ำ ฉบับเต็ม | Thai PBS News', maxStart: 300 },
      { id: 'US-43dAn-VM', title: 'รายการข่าวค่ำ | Thai PBS ประเทศไทย', maxStart: 300 },
      { id: 'J-vAfy2W9Eo', title: 'วิเคราะห์ข่าวเศรษฐกิจและโลก | Thai PBS', maxStart: 180 }
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
      { id: 'xiJPaBcbjLE', title: 'Kompas Petang | Berita Utama Kompas TV Indonesia', maxStart: 180 },
      { id: '61Lvs90OnYc', title: 'Laporan Khusus | Kompas TV Indonesia', maxStart: 200 },
      { id: 'CR-CBMnxxU0', title: 'Berita Nasional | Kompas TV', maxStart: 200 },
      { id: 'KJ3R0FOkRsU', title: 'Breaking News | Kompas TV Jakarta', maxStart: 100 }
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
      { id: 'YLPivFCCfKU', title: 'Buletin AWANI | Berita Terkini Malaysia', maxStart: 25 },
      { id: 'qep7c3KvaNQ', title: 'Laporan Cuaca & Nasional | Astro AWANI', maxStart: 25 },
      { id: '4CtFLMgtg-Q', title: 'Berita Politik & Semasa | Astro AWANI Malaysia', maxStart: 25 },
      { id: 'mkVyNaGee8A', title: 'Siaran Langsung Astro AWANI Malaysia', maxStart: 30 }
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
      { id: 'irIE3JoW1EY', title: '24 Oras Express | GMA Integrated News Philippines', maxStart: 300 },
      { id: 'Wnj3mLPrAMI', title: '24 Oras Full Broadcast | GMA News Pilipinas', maxStart: 300 },
      { id: 'nzR4KC380gk', title: '24 Oras | Balitang Pambansa GMA News', maxStart: 300 },
      { id: 'OHWHg8ta4k0', title: '24 Oras Primetime | GMA Integrated News', maxStart: 300 }
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
      { id: 'GFjZke-hRnM', title: 'Citizen Nipashe Wikendi | Habari za Kiswahili Kenya', maxStart: 300 },
      { id: 'mk1DMW0v3BA', title: 'Citizen Nipashe | Taarifa ya Habari Kenya', maxStart: 300 },
      { id: 'uvSjwDIlFNA', title: 'Nipashe Saaאחת | Citizen TV Kenya', maxStart: 300 }
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
