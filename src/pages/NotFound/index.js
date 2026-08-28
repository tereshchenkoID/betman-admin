import { useTranslation } from "react-i18next"

import { NAVIGATION } from "constant/config"

import Paper from 'components/Paper'
import Reference from 'components/Reference'

import style from './index.module.scss'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <Paper
        classes={['sm']}
        headline={t('notification.page_not_found')}
      >
        <div className={style.grid}>
          <p>{t('notification.text_not_found')}</p>
          <Reference
            to={NAVIGATION.home.link}
            classes={['primary']}
            placeholder={t(NAVIGATION.home.text)}
          />
        </div>
      </Paper>
    </div>
  )
}

export default NotFound
