/**
 * ============================================================================
 * WORLD TV NEWS BROADCASTERS DATABASE (65 Channels • 38 Languages)
 * ============================================================================
 * - Includes only human-approved broadcast videos and studio anchor clips
 * - Supports both `minStart`/`maxStart` windows and multi-range `segments`
 *   (e.g., Macau TDM `MO-2` & `MO-3`, Québec `CA-FR-1`, and Mongolia `MN-1..3`)
 */

const TV_NEWS_BROADCASTERS = [
  // ==========================================================================
  // SPANISH (9 Countries: Spain, Mexico, Argentina, Colombia, Chile,
  //          Uruguay, Venezuela, Cuba, Puerto Rico)
  // ==========================================================================
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
  {
    id: 'uy_tvciudad',
    broadcaster: 'TV Ciudad / Telemundo 12',
    countryCode: 'UY',
    countryName: 'Uruguay',
    countryNative: 'Uruguay',
    flag: '🇺🇾',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UCc7bfb9431234567890ABCD',
    curatedOnly: true,
    videos: [
      // Approved: UY-1, UY-2, UY-3
      { id: 'z4ai1CtGqak', title: 'El sistema carcelario en Uruguay | TV Ciudad', minStart: 8, maxStart: 55 },
      { id: '_Bi5YUWbPEA', title: '¿Por qué los uruguayos somos tan nostálgicos? | TV Ciudad', minStart: 8, maxStart: 60 },
      { id: '0CTM6HRmgqA', title: 'Informe Especial: Penal de Libertad | Telemundo 12 Uruguay', minStart: 12, maxStart: 60 }
    ]
  },
  {
    id: 've_venevision',
    broadcaster: 'Noticias Venevisión',
    countryCode: 'VE',
    countryName: 'Venezuela',
    countryNative: 'Venezuela',
    flag: '🇻🇪',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UCVenevisionNoticiasVE',
    curatedOnly: true,
    videos: [
      // Approved: VE-1, VE-2, VE-3
      { id: 'jBo3eZctYHM', title: 'Entrevista Venevisión: Avances en Chacao | Noticias Venevisión', minStart: 12, maxStart: 60 },
      { id: '8I7ITBg0us8', title: 'Entrevista Venevisión: Pedro Benítez | Venezuela', minStart: 12, maxStart: 60 },
      { id: 'Zxvpva3aA-0', title: 'Entrevista exclusiva: Dinorah Figuera | Noticias Venevisión', minStart: 12, maxStart: 60 }
    ]
  },
  {
    id: 'cu_caribe',
    broadcaster: 'Canal Caribe (Noticiero Cubano)',
    countryCode: 'CU',
    countryName: 'Cuba',
    countryNative: 'Cuba',
    flag: '🇨🇺',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UCCanalCaribeCuba',
    curatedOnly: true,
    videos: [
      // Approved: CU-1, CU-3 (CU-2 disapproved)
      { id: 'hcRjryxYCmo', title: 'Transferencias bancarias en el comercio en Cuba | Canal Caribe', minStart: 10, maxStart: 55 },
      { id: 'Neiyb66PvW0', title: 'Canal Caribe: A cinco años de su salida al aire en Cuba', minStart: 12, maxStart: 60 }
    ]
  },
  {
    id: 'pr_wapa',
    broadcaster: 'NotiCentro WAPA TV',
    countryCode: 'PR',
    countryName: 'Puerto Rico',
    countryNative: 'Puerto Rico',
    flag: '🇵🇷',
    region: 'Americas',
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    family: 'Romance',
    channelId: 'UCWapaTVPuertoRico',
    curatedOnly: true,
    videos: [
      // Approved: PR-1, PR-2, PR-3
      { id: '9qH215d_VOo', title: 'NotiCentro Edición Nocturna | WAPA TV Puerto Rico', minStart: 15, maxStart: 60 },
      { id: 'og2YIssTYsk', title: 'NotiCentro Edición Estelar | WAPA TV Puerto Rico', minStart: 15, maxStart: 60 },
      { id: 'dyJtOTbdDg0', title: 'NotiCentro Fin de Semana | WAPA TV Puerto Rico', minStart: 15, maxStart: 60 }
    ]
  },

  // ==========================================================================
  // PORTUGUESE (5 Countries/Regions: Brazil, Portugal, Angola, Mozambique, Macau)
  // ==========================================================================
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
  {
    id: 'ao_tpa',
    broadcaster: 'TPA Angola (Televisão Pública de Angola)',
    countryCode: 'AO',
    countryName: 'Angola',
    countryNative: 'Angola',
    flag: '🇦🇴',
    region: 'Africa',
    langCode: 'pt',
    langName: 'Portuguese',
    langNative: 'Português',
    family: 'Romance',
    channelId: 'UCTPAOficialAngola',
    curatedOnly: true,
    videos: [
      // Approved: AO-1, AO-2, AO-3
      { id: 'DGMWT-glxSc', title: 'Telejornal TPA Angola (02.11)', minStart: 15, maxStart: 60 },
      { id: '86gbdv-xKT8', title: 'Telejornal TPA Angola (31.10)', minStart: 15, maxStart: 60 },
      { id: 'U1-eMGR2b7I', title: 'Telejornal TPA Angola (21.09)', minStart: 15, maxStart: 60 }
    ]
  },
  {
    id: 'mz_stv',
    broadcaster: 'STV Notícias Moçambique',
    countryCode: 'MZ',
    countryName: 'Mozambique',
    countryNative: 'Moçambique',
    flag: '🇲🇿',
    region: 'Africa',
    langCode: 'pt',
    langName: 'Portuguese',
    langNative: 'Português',
    family: 'Romance',
    channelId: 'UCSTVNoticiasMocambique',
    curatedOnly: true,
    videos: [
      // Approved: MZ-1, MZ-2, MZ-3
      { id: 'FM7sq1mWK7I', title: 'Apreensão de dinheiro sujo | STV Notícias Moçambique', minStart: 10, maxStart: 55 },
      { id: 'EcM2K7wHT18', title: 'Reforço da segurança marítima | STV Notícias Moçambique', minStart: 8, maxStart: 45 },
      { id: 'DZOitAvpJdA', title: 'Reportagem STV: Estrada Nacional N1 em Moçambique', minStart: 15, maxStart: 60 }
    ]
  },
  {
    id: 'mo_tdm',
    broadcaster: 'TDM Canal Macau (Português)',
    countryCode: 'MO',
    countryName: 'Macau',
    countryNative: 'Macau',
    flag: '🇲🇴',
    region: 'Asia',
    langCode: 'pt',
    langName: 'Portuguese',
    langNative: 'Português',
    family: 'Romance',
    channelId: 'UCTDMPortugueseMacau',
    curatedOnly: true,
    videos: [
      // Approved: MO-2 (0:42-2:35 and 5:42-9:56) & MO-3 (0:01-1:14 and 2:33-5:15)
      {
        id: 'wW0-5T_6Ow8',
        title: 'TDM Macau Reportagem – As moradas do cinema',
        segments: [[42, 155], [342, 596]]
      },
      {
        id: '5I0rvXy2-dM',
        title: 'TDM Macau Reportagem – Nacionalidade Perdida',
        segments: [[1, 74], [153, 315]]
      }
    ]
  },

  // ==========================================================================
  // ENGLISH (6 Countries: UK, USA, Australia, Canada, Ireland, New Zealand)
  // ==========================================================================
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
  {
    id: 'ie_rte',
    broadcaster: 'RTÉ News',
    countryCode: 'IE',
    countryName: 'Ireland',
    countryNative: 'Éire / Ireland',
    flag: '🇮🇪',
    region: 'Europe',
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    family: 'Germanic',
    channelId: 'UCRTENewsIreland',
    curatedOnly: true,
    videos: [
      // Approved: IE-1, IE-2 (IE-3 disapproved)
      { id: 'OS4LBttIb-c', title: 'Dublin Traffic & EU Meetings | RTÉ News Ireland', minStart: 8, maxStart: 55 },
      { id: 'vrnHEYOKgPQ', title: 'Dublin Housing & Accommodation Report | RTÉ News', minStart: 6, maxStart: 45 }
    ]
  },
  {
    id: 'nz_1news',
    broadcaster: '1News TVNZ',
    countryCode: 'NZ',
    countryName: 'New Zealand',
    countryNative: 'Aotearoa / New Zealand',
    flag: '🇳🇿',
    region: 'Oceania',
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    family: 'Germanic',
    channelId: 'UC1NewsTVNZNewZealand',
    curatedOnly: true,
    videos: [
      // Approved: NZ-1, NZ-2, NZ-3
      { id: 'FL8qPz3GwWY', title: 'New Zealand Migration Report | 1News TVNZ', minStart: 8, maxStart: 55 },
      { id: 'imUkcLoLa9c', title: 'New Zealand Recycling Rules | TVNZ Breakfast', minStart: 10, maxStart: 55 },
      { id: 'Fueh5-MHqAc', title: 'National Report | 1News TVNZ New Zealand', minStart: 8, maxStart: 55 }
    ]
  },

  // ==========================================================================
  // FRENCH (4 Countries: France, Switzerland, Belgium, Canada/Québec)
  // ==========================================================================
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
  {
    id: 'ch_rts',
    broadcaster: 'RTS Info (Le 19h30 Suisse)',
    countryCode: 'CH',
    countryName: 'Switzerland',
    countryNative: 'Suisse / Schweiz',
    flag: '🇨🇭',
    region: 'Europe',
    langCode: 'fr',
    langName: 'French',
    langNative: 'Français',
    family: 'Romance',
    channelId: 'UCRTSInfoSuisse',
    curatedOnly: true,
    videos: [
      // Approved: CH-FR-1, CH-FR-2, CH-FR-3
      { id: 'IYrbDn0lU_g', title: 'Pourquoi les bistrots de village disparaissent en Suisse romande | RTS', minStart: 10, maxStart: 55 },
      { id: '3Dnqs_bSYSw', title: 'Les Suisses face à un choix historique sur la neutralité | RTS', minStart: 10, maxStart: 55 },
      { id: 'FUj6wec6S38', title: 'La détresse des vignerons suisses | RTS Suisse', minStart: 15, maxStart: 60 }
    ]
  },
  {
    id: 'be_rtbf',
    broadcaster: 'RTBF Info (Le JT Belgique)',
    countryCode: 'BE',
    countryName: 'Belgium',
    countryNative: 'Belgique / België',
    flag: '🇧🇪',
    region: 'Europe',
    langCode: 'fr',
    langName: 'French',
    langNative: 'Français',
    family: 'Romance',
    channelId: 'UCRTBFInfoBelgique',
    curatedOnly: true,
    videos: [
      // Approved: BE-FR-1, BE-FR-2, BE-FR-3
      { id: 'aXMah9K3Tq8', title: 'Service militaire volontaire en Belgique | RTBF Info', minStart: 8, maxStart: 50 },
      { id: 'N8wsR7fjn6k', title: 'La Belgique sous un soleil de plomb | RTBF Info', minStart: 12, maxStart: 60 },
      { id: 'CBswupFsjG4', title: 'Niveau de menace selon l’OCAM | RTBF Info Belgique', minStart: 10, maxStart: 55 }
    ]
  },
  {
    id: 'ca_rc',
    broadcaster: 'Radio-Canada Info (Le Téléjournal Québec)',
    countryCode: 'CA',
    countryName: 'Canada',
    countryNative: 'Canada (Québec)',
    flag: '🇨🇦',
    region: 'Americas',
    langCode: 'fr',
    langName: 'French',
    langNative: 'Français',
    family: 'Romance',
    channelId: 'UCRadioCanadaInfo',
    curatedOnly: true,
    videos: [
      // Approved: CA-FR-1 (Skip first 3m29s = 209s) & CA-FR-3 (CA-FR-2 disapproved)
      { id: 'ltAaldXhH64', title: 'Le Téléjournal Québec | Radio-Canada Info', minStart: 210, maxStart: 320 },
      { id: 'UV5rOhuWv2k', title: 'Fin du PEQ : Le Téléjournal 18h | Radio-Canada', minStart: 10, maxStart: 55 }
    ]
  },

  // ==========================================================================
  // GERMAN (3 Countries: Germany, Austria, Switzerland)
  // ==========================================================================
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
  {
    id: 'ch_srf',
    broadcaster: 'SRF Tagesschau (Schweiz)',
    countryCode: 'CH',
    countryName: 'Switzerland',
    countryNative: 'Schweiz / Suisse',
    flag: '🇨🇭',
    region: 'Europe',
    langCode: 'de',
    langName: 'German',
    langNative: 'Deutsch',
    family: 'Germanic',
    channelId: 'UCSRFNewsSchweiz',
    curatedOnly: true,
    videos: [
      // Approved: CH-DE-1, CH-DE-2, CH-DE-3
      { id: 'WV4dWtSPNaw', title: 'SRF Tagesschau Hauptausgabe 19:30 (13.09) | Schweiz', minStart: 12, maxStart: 60 },
      { id: '393cOUnG4cE', title: 'SRF Tagesschau Hauptausgabe 19:30 (15.09) | Schweiz', minStart: 12, maxStart: 60 },
      { id: '6reDoR8fMh4', title: 'SRF Tagesschau Hauptausgabe 19:30 (14.09) | Schweiz', minStart: 12, maxStart: 60 }
    ]
  },

  // ==========================================================================
  // ITALIAN, DUTCH, GREEK, ROMANIAN
  // ==========================================================================
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

  // ==========================================================================
  // SLAVIC LANGUAGES & COUNTRIES (Poland, Russia, Ukraine, Czechia,
  //                               Serbia, Croatia, Bulgaria)
  // ==========================================================================
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
  {
    id: 'cz_ct24',
    broadcaster: 'ČT24 / CNN Prima NEWS',
    countryCode: 'CZ',
    countryName: 'Czechia',
    countryNative: 'Česko',
    flag: '🇨🇿',
    region: 'Europe',
    langCode: 'cs',
    langName: 'Czech',
    langNative: 'Čeština',
    family: 'Slavic',
    channelId: 'UCCNNPrimaNewsCzechia',
    curatedOnly: true,
    videos: [
      // Approved: CZ-2, CZ-3 (CZ-1 disapproved)
      { id: 'lZxtoHi8iHk', title: 'Hlavní zprávy | CNN Prima NEWS Česko', minStart: 8, maxStart: 50 },
      { id: 'equ7O-1Ext4', title: 'Newsroom ČT24 | Česká televize', minStart: 8, maxStart: 45 }
    ]
  },
  {
    id: 'rs_rts',
    broadcaster: 'RTS Oko / Dnevnik (Srbija)',
    countryCode: 'RS',
    countryName: 'Serbia',
    countryNative: 'Србија / Srbija',
    flag: '🇷🇸',
    region: 'Europe',
    langCode: 'sr',
    langName: 'Serbian',
    langNative: 'Српски',
    family: 'Slavic',
    channelId: 'UCRTSOkoSrbija',
    curatedOnly: true,
    videos: [
      // Approved: RS-1, RS-2, RS-3
      { id: '6D6Jpqp071Y', title: 'Posle izbora, kuda ide srpska ekonomija | RTS Oko', minStart: 15, maxStart: 60 },
      { id: 'RnxRaIH3PQc', title: 'Politički zemljotres u Srbiji | RTS Oko', minStart: 15, maxStart: 60 },
      { id: 'yhIhQbz3wPM', title: 'Zašto Poštanska nije Alta | RTS Oko Srbija', minStart: 15, maxStart: 60 }
    ]
  },
  {
    id: 'hr_hrt',
    broadcaster: 'HRT Vijesti (Dnevnik)',
    countryCode: 'HR',
    countryName: 'Croatia',
    countryNative: 'Hrvatska',
    flag: '🇭🇷',
    region: 'Europe',
    langCode: 'hr',
    langName: 'Croatian',
    langNative: 'Hrvatski',
    family: 'Slavic',
    channelId: 'UCHRTVijestiHrvatska',
    curatedOnly: true,
    videos: [
      // Approved: HR-1, HR-2, HR-3
      { id: 'WcD3hrFWttU', title: 'Dnevnik HRT Vijesti (11.11) | Hrvatska', minStart: 15, maxStart: 60 },
      { id: '2wg_KveF61Y', title: 'Dnevnik HRT Vijesti (12.11) | Hrvatska', minStart: 15, maxStart: 60 },
      { id: 'Mw7yOk1BHlk', title: 'Dnevnik HRT Vijesti (13.11) | Hrvatska', minStart: 15, maxStart: 60 }
    ]
  },
  {
    id: 'bg_btv',
    broadcaster: 'bTV Новините',
    countryCode: 'BG',
    countryName: 'Bulgaria',
    countryNative: 'България',
    flag: '🇧🇬',
    region: 'Europe',
    langCode: 'bg',
    langName: 'Bulgarian',
    langNative: 'Български',
    family: 'Slavic',
    channelId: 'UCbTVNoviniteBulgaria',
    curatedOnly: true,
    videos: [
      // Approved: BG-1, BG-2 (BG-3 disapproved)
      { id: '6t_BPL-yHq4', title: 'Катастрофата на АМ Тракия | bTV Новините България', minStart: 10, maxStart: 55 },
      { id: '_u5vx9V-ZbE', title: 'Как бурята удари София? | bTV Новините България', minStart: 10, maxStart: 55 }
    ]
  },

  // ==========================================================================
  // ARABIC (4 Countries: Qatar, Saudi Arabia, Morocco, Egypt)
  // ==========================================================================
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
  {
    id: 'ma_2m',
    broadcaster: '2M Maroc (المسائية)',
    countryCode: 'MA',
    countryName: 'Morocco',
    countryNative: 'المغرب',
    flag: '🇲🇦',
    region: 'Africa',
    langCode: 'ar',
    langName: 'Arabic',
    langNative: 'العربية',
    family: 'Semitic',
    channelId: 'UC2MMarocNews',
    curatedOnly: true,
    videos: [
      // Approved: MA-1, MA-2, MA-3
      { id: 'MsfxmOwLJA8', title: 'المسائية : نشرة الأخبار | 2M Maroc المغرب', minStart: 15, maxStart: 60 },
      { id: 'IEynE8ha2bo', title: 'أخبار المسائية القناة الثانية دوزيم | 2M Maroc', minStart: 15, maxStart: 60 },
      { id: 'hvXsqC7dz6o', title: 'أخبار المسائية بالمغرب على القناة الثانية 2M', minStart: 12, maxStart: 55 }
    ]
  },
  {
    id: 'eg_alqahera',
    broadcaster: 'Al Qahera News (القاهرة الإخبارية)',
    countryCode: 'EG',
    countryName: 'Egypt',
    countryNative: 'مصر',
    flag: '🇪🇬',
    region: 'Africa',
    langCode: 'ar',
    langName: 'Arabic',
    langNative: 'العربية',
    family: 'Semitic',
    channelId: 'UCAlQaheraNewsEgypt',
    curatedOnly: true,
    videos: [
      // Approved: EG-1, EG-2, EG-3
      { id: '3EUwgn1pWFI', title: 'نشرة أخبار الثانية عشرة ظهرًا | القاهرة الإخبارية', minStart: 15, maxStart: 60 },
      { id: 'RUVYTg4wnC0', title: 'موجز أخبار السادسة صباحا | القاهرة الإخبارية مصر', minStart: 10, maxStart: 50 },
      { id: 'xC0qiViUKe4', title: 'نشرة أخبار الثالثة عصرًا | القاهرة الإخبارية', minStart: 15, maxStart: 60 }
    ]
  },

  // ==========================================================================
  // TURKISH, KAZAKH, UZBEK, MONGOLIAN
  // ==========================================================================
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
  {
    id: 'kz_qazaqstan',
    broadcaster: 'Qazaqstan TV (Aqparat / Ақпарат)',
    countryCode: 'KZ',
    countryName: 'Kazakhstan',
    countryNative: 'Қазақстан',
    flag: '🇰🇿',
    region: 'Asia',
    langCode: 'kk',
    langName: 'Kazakh',
    langNative: 'Қазақша',
    family: 'Turkic',
    channelId: 'UCQazaqstanTVAqparat',
    curatedOnly: true,
    videos: [
      // Approved: KZ-1, KZ-2
      { id: 'RNNKEs6qSCY', title: 'Ақпарат 17:00 Толық нұсқа | Qazaqstan TV', minStart: 15, maxStart: 60 },
      { id: 'Kq_1wk3J8hw', title: 'Ақпарат 10:00 Толық нұсқа | Qazaqstan TV', minStart: 15, maxStart: 60 }
    ]
  },
  {
    id: 'uz_uzbekiston24',
    broadcaster: 'Oʻzbekiston 24 (Axborot 24)',
    countryCode: 'UZ',
    countryName: 'Uzbekistan',
    countryNative: 'Oʻzbekiston',
    flag: '🇺🇿',
    region: 'Asia',
    langCode: 'uz',
    langName: 'Uzbek',
    langNative: 'Oʻzbekcha',
    family: 'Turkic',
    channelId: 'UCOzbekiston24Axborot',
    curatedOnly: true,
    videos: [
      // Approved: UZ-1, UZ-2
      { id: 'RtDme8PmXqQ', title: 'Mobil reportaj | Axborot 24 Oʻzbekiston 24', minStart: 10, maxStart: 55 },
      { id: 'ljOyvYmLJNw', title: 'Axborot 24 Yangiliklar | Oʻzbekiston 24', minStart: 6, maxStart: 40 }
    ]
  },
  {
    id: 'mn_mnb',
    broadcaster: 'MNB Монголын Мэдээ (Цагийн хүрд)',
    countryCode: 'MN',
    countryName: 'Mongolia',
    countryNative: 'Монгол Улс',
    flag: '🇲🇳',
    region: 'Asia',
    langCode: 'mn',
    langName: 'Mongolian',
    langNative: 'Монгол',
    family: 'Mongolic',
    channelId: 'UCMNBMongolianNews',
    curatedOnly: true,
    videos: [
      // Approved: MN-1 (skip first 1m21s = 81s), MN-2 (skip first 44s), MN-3 (skip first 35s)
      { id: 'lVEDVxkSvX0', title: '“Цагийн хүрд” мэдээллийн хөтөлбөр (11.11) | MNB', minStart: 82, maxStart: 165 },
      { id: '_E1N1LcfHuY', title: '“Цагийн хүрд” мэдээллийн хөтөлбөр (11.09) | MNB', minStart: 45, maxStart: 130 },
      { id: 'jMYU7Yg-LLw', title: '“Цагийн хүрд” мэдээллийн хөтөлбөр (11.07) | MNB', minStart: 36, maxStart: 120 }
    ]
  },

  // ==========================================================================
  // PERSIAN, HEBREW, HINDI, URDU, BENGALI
  // ==========================================================================
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

  // ==========================================================================
  // EAST & SOUTHEAST ASIA (Japan, South Korea, North Korea, Taiwan,
  //                        Mainland China, Hong Kong, Vietnam, Thailand,
  //                        Cambodia, Myanmar, Indonesia, Malaysia, Philippines)
  // ==========================================================================
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
  {
    id: 'kp_kctv',
    broadcaster: 'KCTV (조선중앙텔레비죤)',
    countryCode: 'KP',
    countryName: 'North Korea',
    countryNative: '조선민주주의인민공화국',
    flag: '🇰🇵',
    region: 'Asia',
    langCode: 'ko',
    langName: 'Korean',
    langNative: '조선어 / 한국어',
    family: 'Koreanic',
    channelId: 'UCKCTVNorthKorea',
    curatedOnly: true,
    videos: [
      // Approved: KP-1
      { id: 'YIMgD9ta_JE', title: '조선중앙텔레비죤 20시보도 | KCTV Evening News', minStart: 35, maxStart: 120 }
    ]
  },
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
  {
    id: 'cn_cctv',
    broadcaster: 'CCTV (中国中央电视台 - 新闻联播)',
    countryCode: 'CN',
    countryName: 'China',
    countryNative: '中国',
    flag: '🇨🇳',
    region: 'Asia',
    langCode: 'zh',
    langName: 'Chinese',
    langNative: '中文',
    family: 'Sino-Tibetan',
    channelId: 'UCCCTVChinaNews',
    curatedOnly: true,
    videos: [
      // Approved: CN-1, CN-2
      { id: 'fICzjy7FQQA', title: 'CCTV《新闻联播》Xinwen Lianbo Evening Broadcast', minStart: 25, maxStart: 85 },
      { id: '2Rc1FWQJCTY', title: 'CCTV中文《新闻直播间》News Report', minStart: 10, maxStart: 50 }
    ]
  },
  {
    id: 'hk_tvb',
    broadcaster: 'TVB News (無綫新聞)',
    countryCode: 'HK',
    countryName: 'Hong Kong',
    countryNative: '香港',
    flag: '🇭🇰',
    region: 'Asia',
    langCode: 'yue',
    langName: 'Cantonese',
    langNative: '粵語',
    family: 'Sino-Tibetan',
    channelId: 'UCTVBNewsHongKong',
    curatedOnly: true,
    videos: [
      // Approved: HK-1, HK-2, HK-3
      { id: '2GMQRHnuc1Y', title: '新聞透視｜香港流行文化｜無綫新聞 TVB News', minStart: 15, maxStart: 65 },
      { id: 'vNjSrc3XbTc', title: '新聞透視｜網購熱潮致過度包裝｜無綫新聞 TVB News', minStart: 15, maxStart: 65 },
      { id: 'lbJw4BBiToc', title: '新聞透視｜何謂預製菜｜無綫新聞 TVB News', minStart: 15, maxStart: 65 }
    ]
  },
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
  {
    id: 'kh_btv',
    broadcaster: 'BTV News Cambodia',
    countryCode: 'KH',
    countryName: 'Cambodia',
    countryNative: 'កម្ពុជា',
    flag: '🇰🇭',
    region: 'Asia',
    langCode: 'km',
    langName: 'Khmer',
    langNative: 'ភាសាខ្មែរ',
    family: 'Austroasiatic',
    channelId: 'UCBTVNewsCambodia',
    curatedOnly: true,
    videos: [
      // Approved: KH-2 (KH-1 disapproved)
      { id: 'jHLTI50NULk', title: 'ព័ត៌មានសំខាន់ៗ | BTV News Cambodia', minStart: 15, maxStart: 70 }
    ]
  },
  {
    id: 'mm_dvb',
    broadcaster: 'DVB TV News',
    countryCode: 'MM',
    countryName: 'Myanmar',
    countryNative: 'မြန်မာ',
    flag: '🇲🇲',
    region: 'Asia',
    langCode: 'my',
    langName: 'Burmese',
    langNative: 'မြန်မာဘာသာ',
    family: 'Sino-Tibetan',
    channelId: 'UCDVBTVNewsMyanmar',
    curatedOnly: true,
    videos: [
      // Approved: MM-1, MM-2
      { id: 'v0bEXUrd-FE', title: 'DVB TV နေ့စဉ်သတင်း အနှစ်ချုပ် - Daily News Briefing', minStart: 15, maxStart: 65 },
      { id: '1vdX0tT8LbI', title: 'DVB Digital ည ၇ နာရီ သတင်း (7PM News)', minStart: 15, maxStart: 65 }
    ]
  },
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

  // ==========================================================================
  // SWAHILI (Kenya)
  // ==========================================================================
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
    UY: 'Uruguay', VE: 'Venezuela', CU: 'Cuba', PR: 'Puerto Rico',
    GB: 'Reino Unido', US: 'Estados Unidos', AU: 'Australia', CA: 'Canadá',
    IE: 'Irlanda', NZ: 'Nueva Zelanda',
    BR: 'Brasil', PT: 'Portugal', AO: 'Angola', MZ: 'Mozambique', MO: 'Macao',
    FR: 'Francia', BE: 'Bélgica', CH: 'Suiza',
    DE: 'Alemania', AT: 'Austria',
    IT: 'Italia', NL: 'Países Bajos', GR: 'Grecia', RO: 'Rumania',
    PL: 'Polonia', RU: 'Rusia', UA: 'Ucrania', CZ: 'Chequia',
    RS: 'Serbia', HR: 'Croacia', BG: 'Bulgaria',
    TR: 'Turquía', KZ: 'Kazajistán', UZ: 'Uzbekistán', MN: 'Mongolia',
    QA: 'Catar', SA: 'Arabia Saudita', MA: 'Marruecos', EG: 'Egipto',
    IR: 'Irán', IL: 'Israel', IN: 'India', PK: 'Pakistán', BD: 'Bangladés',
    JP: 'Japón', KR: 'Corea del Sur', KP: 'Corea del Norte',
    TW: 'Taiwán', CN: 'China', HK: 'Hong Kong',
    VN: 'Vietnam', TH: 'Tailandia', KH: 'Camboya', MM: 'Birmania (Myanmar)',
    ID: 'Indonesia', MY: 'Malasia', PH: 'Filipinas', KE: 'Kenia'
  },
  pt: {
    ES: 'Espanha', MX: 'México', AR: 'Argentina', CO: 'Colômbia', CL: 'Chile',
    UY: 'Uruguai', VE: 'Venezuela', CU: 'Cuba', PR: 'Porto Rico',
    GB: 'Reino Unido', US: 'Estados Unidos', AU: 'Austrália', CA: 'Canadá',
    IE: 'Irlanda', NZ: 'Nova Zelândia',
    BR: 'Brasil', PT: 'Portugal', AO: 'Angola', MZ: 'Moçambique', MO: 'Macau',
    FR: 'França', BE: 'Bélgica', CH: 'Suíça',
    DE: 'Alemanha', AT: 'Áustria',
    IT: 'Itália', NL: 'Países Baixos', GR: 'Grécia', RO: 'Romênia',
    PL: 'Polônia', RU: 'Rússia', UA: 'Ucrânia', CZ: 'Tchéquia',
    RS: 'Sérvia', HR: 'Croácia', BG: 'Bulgária',
    TR: 'Turquia', KZ: 'Cazaquistão', UZ: 'Uzbequistão', MN: 'Mongólia',
    QA: 'Catar', SA: 'Arábia Saudita', MA: 'Marrocos', EG: 'Egito',
    IR: 'Irã', IL: 'Israel', IN: 'Índia', PK: 'Paquistão', BD: 'Bangladesh',
    JP: 'Japão', KR: 'Coreia do Sul', KP: 'Coreia do Norte',
    TW: 'Taiwan', CN: 'China', HK: 'Hong Kong',
    VN: 'Vietnã', TH: 'Tailândia', KH: 'Camboja', MM: 'Mianmar',
    ID: 'Indonésia', MY: 'Malásia', PH: 'Filipinas', KE: 'Quênia'
  }
};
