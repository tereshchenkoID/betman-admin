import { useTranslation } from 'react-i18next'

import clsx from 'clsx'

import style from './index.module.scss'

const Tab = ({ data, action, options }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      {
        options?.map(([key, value]) =>
          <button
            type={'button'}
            key={key}
            className={
              clsx(
                style.link,
                data === key && style.active
              )
            }
            onClick={() => action(key)}
            aria-label={t(value)}
          >
            {t(value)}
          </button>
        )
      }
    </div>
  )
}

export default Tab
