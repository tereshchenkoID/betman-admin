export const NAVIGATION = {
  home: {
    text: 'navigation.home',
    link: '/',
  },
  dashboard: {
    text: 'navigation.dashboard',
    link: '/',
  },
  agents: {
    text: 'navigation.agents',
    icon: 'fa-solid fa-users',
    link: '/users/agents',
  },
  shops: {
    text: 'navigation.shops',
    icon: 'fa-solid fa-shop',
    link: '/users/shops',
  },
  cashiers: {
    text: 'navigation.cashiers',
    icon: 'fa-solid fa-cash-register',
    link: '/users/cashiers',
  },
  players: {
    text: 'navigation.players',
    icon: 'fa-solid fa-users',
    link: '/users/players',
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
    jackpots: {
      text: 'navigation.jackpots',
      link: '/managements/jackpots'
    },
    bonuses: {
      text: 'navigation.bonuses',
      link: '/managements/bonuses'
    },
  },

  login: {
    text: 'navigation.login',
    link: '/login'
  }
};

export const ACCOUNT_TYPE = {
  'ADMIN':    '-1',
  'AGENT':    '0',
  'SHOP':     '1',
  'CASHIER':  '2',
  'PLAYER':   '3'
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
    '#ff6384',
    '#2ecc71',
    '#e67e22',
    '#34495e',
    '#f1c40f',
    '#e74c3c',
    '#1abc9c',
    '#95a5a6',
    '#d35400'
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
