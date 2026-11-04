// ============================================================
// config.js
// CES Hub GitHub Frontend Configuration
// Frontend only. Sheet IDs are checked through Apps Script health API.
// ============================================================

window.CES_CONFIG = {
  // IMPORTANT: After deploying Apps Script backend, paste the latest /exec URL here.
  GAS_API_URL: '', // PASTE NEW BOUND APPS SCRIPT /exec URL BEFORE PUBLISHING,
  // Optional extra /exec endpoints. The polyfill also accepts ?gasApiUrl=<url>
  // and persists that override, so a deployment URL can be corrected without
  // allowing every module to fail independently.
  GAS_API_URL_FALLBACKS: [],

  CSI_SURVEY_URL: 'https://survey.nhealth-asia.com/s/cm1hci0mw00jf45vmps2myg1g',

  APP_NAME: 'CES Hub',

  // LINE OA / LIFF client-side public configuration. No secrets belong here.
  LINE_OA: {
    ENABLED: true,
    OA_BASIC_ID: '@032jntyw',
    MESSAGING_CHANNEL_ID: '2007009771',
    LOGIN_CHANNEL_ID: '2009944147',
    LIFF_ID: '2009944147-iluulCQj',
    LIFF_SDK_URL: 'https://static.line-scdn.net/liff/edge/2/sdk.js',
    ENDPOINT_URL: 'https://siripak-ch.github.io/CES-Hub/'
  },

  DEBUG: false,
  RELEASE: 'CES-HUB-BOUND-MIGRATION',

  // External links are kept in one place. Config sheet values override these defaults at runtime.
  EXTERNAL_LINKS: {
    CONFIG_SHEET: 'https://docs.google.com/spreadsheets/d/1gsI3bPPIBi7lLynDGEBp5OLeYsgu2pTHiCKSuEEcBWA/edit?gid=1870451409#gid=1870451409',
    CES_EVALUATION_DATA: 'https://docs.google.com/spreadsheets/d/1gaTh8YFBWDX7cPFsdElzyMdGbbu6LZwYYe5I5VXrwVs/edit',
    SERVICE_CSI_CES_SUMMARY: 'https://survey.nhealth-asia.com/environments/cm5l2u5sl0008pv01is0nqdv5/surveys/cm1hci0mw00jf45vmps2myg1g/summary?referer=true',
    SERVICE_CSI_TES_SUMMARY: 'https://survey.nhealth-asia.com/environments/cm5l2u5sl0008pv01is0nqdv5/surveys/uyyoxtx5xogrpidf3gbmc6k2/summary',
    REPORT_CSI_SUMMARY: 'https://survey.nhealth-asia.com/environments/cm5l2u5sl0008pv01is0nqdv5/surveys/cmcu51nfa00e8s3010s2ukzvb/summary',
    REVENUE_DASHBOARD: 'https://nsmartplusdashboard.nhealth-asia.com/#/signin?externalRedirect=%2Ft%2FCustomerExperience%2Fviews%2FCES-HQFinancialPerformance%2FCES-HQ%3F%3Aiid%3D1%26&site=CustomerExperience',
    KPI_EHS_SHEET: 'https://docs.google.com/spreadsheets/d/1yBK0fyYI1nW2ye5-tHTTvttTPVK0JBciHu9alyGK8-s/edit?usp=sharing',
    KPI_LAB_SHEET: 'https://docs.google.com/spreadsheets/d/1cdiwOpRZzU-MNLALEtcfpn-8HReLfz9tJkKhJzA0lKw/edit?usp=sharing',
    MEMO_WORKORDER_SOURCE: 'https://docs.google.com/spreadsheets/d/1nuyl-hp-I-nP0mQ9u9GVZTcOQHCBtCvrv5aOM_yx7B4/edit?usp=sharing',
    JOB_RECORD_SOURCE: 'https://bdmsgroup-my.sharepoint.com/:x:/r/personal/nhbmecallab_bdms_co_th/Documents/33.%20Job%20Record%20Mobile%20Service/Job%20Record%20Mobile%20service%202025%20Rv.1.xlsx?d=w65bc2caadef04df99f0237be2438f710&csf=1&web=1&e=C8Y1ox',
    TRAINING_PLAN_2026: 'https://docs.google.com/spreadsheets/d/1qBR-KQ5cxVWw6iGWIxmYI9aXr3oTlhcu51JaQeBnxcw/edit?usp=sharing',
    VAN_BOOKING_FORM: 'https://forms.gle/Tra5UBHtbMWpXvhr7',
    E_REQUEST: 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=vkBcMittBkCyxQeJR8hW0rSvo_9RxKxPlvy4TSI-BLZUMVlZMjhaR1MwU1NPSDVKU0ZVTEdFMDNHVS4u&route=shorturl',
    CAR_BOOKING_DRIVE: 'https://drive.google.com/drive/folders/1rZyBY-g0h3QkVI2H2LD1x2ER5oWDueyx?usp=drive_link',
    VAN_GOOGLE_CALENDAR: 'https://calendar.google.com/calendar/u/0/r?cid=4a66f8df81e68d752715957a3805219e951d91c7b1c375e8996424ca2c55fef6%40group.calendar.google.com',
    VAN_LG_BOOKING: 'https://bdmsgroup-my.sharepoint.com/:x:/g/personal/nathithon_ko_bdms_co_th/IQDvxgTh2ZXUR6isdhw9DQ8uAfEp1IaZyZB-UmJPt6yqqYc?e=AhAlaw',
    VAN_NMOBILE: 'https://nmobileplus.nhealth-asia.com/login',
    GIZTIX_DELIVERY: 'https://giztix.com/'
  },

  // AI CES V22.8: Gemini Online is the primary reasoning layer when configured; verified CES data is grounded first and local data is fallback only.
  AI_LOCAL: {
    ENABLED: true,
    KNOWLEDGE_SOURCE: 'BACKEND',
    CACHE_TTL_MINUTES: 120,
    MIN_SCORE: 18,
    MAX_RELATED: 3,
    LOG_QUESTIONS: true,
    SHOW_SOURCE: true,
    ENABLE_EVALUATION: true,
    EVALUATION_DELAY_MS: 90000,
    ONLINE_FALLBACK: true
  },

  SYNC_POLICY: {
    HOME_FIRST: true,
    LIVE_TTL_MS: { calendar:60000, car_booking:30000, van_booking:30000, stock_dashboard:60000, inventory:60000, check_stock:30000 },
    CACHE_SESSION_TABS: ['portal','management_overview','yearly','revenue','ot','service','report','memo_workorder','checkin','weekly','report_manage','kpi','team_information','monthly_report','users','ces_evaluation','ces_ai_knowledge','setting']
  },

  PERFORMANCE: {
    MODULE_CACHE_TTL_MS: 600000,
    VEHICLE_CACHE_TTL_MS: 300000,
    PORTAL_CACHE_TTL_MS: 600000,
    PREVENT_DUPLICATE_LOADS: true
  },

  EXPECTED_SHEETS: {
    MAIN:  '1gsI3bPPIBi7lLynDGEBp5OLeYsgu2pTHiCKSuEEcBWA',
    KPI:   '1yBK0fyYI1nW2ye5-tHTTvttTPVK0JBciHu9alyGK8-s',
    LAB_KPI: '1cdiwOpRZzU-MNLALEtcfpn-8HReLfz9tJkKhJzA0lKw',
    MEMO: '1nuyl-hp-I-nP0mQ9u9GVZTcOQHCBtCvrv5aOM_yx7B4',
    STOCK: '1G9FQXQ8Nh7_2pQeUD-ryTnMTLBAUWFmYt5SQ8WHSgCA'
  }
};

// CES Hub Drive destinations (links may require an authorised Google account).
window.CES_STORAGE_LINKS = {
  "PORTAL_EVENTS": "https://drive.google.com/drive/folders/1Tq1LA_HlQQPPOpkCsuY4SLZldmtwv5YO",
  "CHECKIN": "https://drive.google.com/drive/folders/1AyLx6qYpMKm5_x4GxILnbzTZ2JMiWtCg",
  "WEEKLY": "https://drive.google.com/drive/folders/1IXyynAMSpWd3BmStkD1mNXL3XUMwcT6q",
  "OT": "https://drive.google.com/drive/folders/1WAyDcMvH86V1l4zoX9OEjENhWvE071EG",
  "SERVICE": "https://drive.google.com/drive/folders/1GZhfAHbSG4nlvkfMYRCy0rnUfT9sEeiy",
  "SIGNATURE": "https://drive.google.com/drive/folders/1GZhfAHbSG4nlvkfMYRCy0rnUfT9sEeiy",
  "TE": "https://drive.google.com/drive/folders/1-aF5DW2DnK_a1RTwY5Y-e1opbx6kmzhv",
  "VEHICLE": "https://drive.google.com/drive/folders/1rZyBY-g0h3QkVI2H2LD1x2ER5oWDueyx"
};
window.CES_STORAGE_LINKS.LOGO = "img/ces-logo.jpg";
