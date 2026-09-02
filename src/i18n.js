import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { LANGUAGE } from 'constant/config'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: JSON.parse(sessionStorage.getItem('language')) || LANGUAGE,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
