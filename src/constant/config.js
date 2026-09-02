export const NAVIGATION = {
  home: {
    text: 'navigation.home',
    link: '/',
  },
  dashboard: {
    text: 'navigation.dashboard',
    link: '/',
  },
  users: {
    text: 'navigation.users',
    icon: 'fa-solid fa-user',
    link: '/users',
  },
  players: {
    text: 'navigation.players',
    icon: 'fa-solid fa-users',
    link: '/players',
  },
  reports: {
    text: 'navigation.reports',
    icon: 'fa-solid fa-file',
    financial: {
      text: 'navigation.financial',
      link: '/reports/financial',
    },
    games: {
      text: 'navigation.games',
      link: '/reports/games',
    },
    summary: {
      text: 'navigation.summary',
      link: '/reports/summary',
    },
    history: {
      text: 'navigation.history',
      link: '/reports/history',
    },
    payments: {
      text: 'navigation.payments',
      link: '/reports/payments',
    },
    bonuses: {
      text: 'navigation.bonuses',
      link: '/reports/bonuses',
    },
  },
  managements: {
    text: 'navigation.managements',
    icon: 'fa-solid fa-bars-progress',
    promos: {
      text: 'navigation.promos',
      link: '/managements/promos'
    },
    banners: {
      text: 'navigation.banners',
      link: '/managements/banners'
    },
    challenges: {
      text: 'navigation.challenges',
      link: '/managements/challenges'
    },
    quests: {
      text: 'navigation.quests',
      link: '/managements/quests'
    },
    jackpots: {
      text: 'navigation.jackpots',
      link: '/managements/jackpots'
    },
    bonuses: {
      text: 'navigation.bonuses',
      link: '/managements/bonuses'
    },
    notifications: {
      text: 'navigation.notifications',
      link: '/managements/notifications'
    },
    pages: {
      text: 'navigation.pages',
      link: '/managements/pages'
    },
    wheels: {
      text: 'navigation.wheels',
      link: '/managements/wheels',
    },
    modules: {
      text: 'navigation.modules',
      link: '/managements/modules'
    },
    tooltips: {
      text: 'navigation.tooltips',
      link: '/managements/tooltips'
    },
    seo: {
      text: 'navigation.seo',
      link: '/managements/seo'
    },
  },
  login: {
    text: 'navigation.login',
    link: '/login'
  }
};

export const ACCOUNT_LEVEl = {
  'ADMIN': '0',
  'MANAGER': '1',
  'FINANCIAL': '2',
  'SUPPORT': '3',
  'MARKETING': '4'
}

export const ACCOUNT_TYPE = {
  0: 'admin',
  1: 'manager',
  2: 'financial',
  3: 'support',
  4: 'marketing'
}

export const ACCESS_TYPE = {
  0: 'denied',
  1: 'allowed'
}

export const VERIFICATION_TYPE = {
  0: 'not_verified',
  1: 'pending_verification',
  2: 'rejected',
  3: 'verified'
}

export const RISK_TYPE = {
  0: 'new_player',
  1: 'normal_player',
  2: 'bonus_hunter',
  3: 'high_risk_player',
  4: 'scammer',
  5: 'vip_level_1',
  6: 'vip_level_2',
  7: 'vip_level_3',
}

export const TIMEFRAMES = {
  0: 'current_hours',
  1: 'today',
  2: 'this_week',
  3: 'this_month',
  4: 'last_hours',
  5: 'yesterday',
  6: 'last_week',
  7: 'last_month',
}

export const REQUEST_TYPE = {
  'GET':      'GET',
  'POST':     'POST',
}

export const service = {
  COLORS: [
    '#ff6384',
    '#36a2eb',
    '#ffce56',
    '#4bc0c0',
    '#8e5d4e',
    '#9b59b6',
    '#2ecc71',
    '#e67e22',
    '#34495e',
    '#f1c40f',
    '#e74c3c',
    '#1abc9c',
    '#95a5a6',
    '#d35400',
    '#3498db',
    '#a29bfe',
    '#fd79a8',
    '#00cec9',
    '#6c5ce7',
    '#fdcb6e',
    '#e17055',
    '#00b894',
    '#ff7675',
    '#0984e3',
    '#b2bec3',
    '#81ecec',
    '#55efc4',
    '#636e72',
    '#16a085'
  ],

  YES_NO: {
    0: 'no',
    1: 'yes',
  },

  QUANTITY: {
    20: 20,
    50: 50,
    100: 100,
  },

  ENABLE_DISABLE: {
    0: 'enable',
    1: 'disable',
  }
}

export const LANGUAGE = 'en'
