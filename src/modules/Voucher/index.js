import { useTranslation } from 'react-i18next'

import { useAuth } from 'hooks/useAuth'
import { getDate } from 'helpers/getDate'

import style from './index.module.scss'

const Voucher = ({ data, isPaid }) => {
  const { t } = useTranslation()
  const { auth } = useAuth()

  return (
    <div className={style.block}>
      <div className={style.button}>
        <span className={style.content}>
          <h6 className={style.title}>
            <span className={style.label}>{t('voucher')}:</span>
            {data.code}
          </h6>
          <strong className={style.amount}>
            <span className={style.label}>{t('amount')}:</span>
            {data.amount} {auth.currency.code}
          </strong>
          <span className={style.date}>
            {
              data.expire
              ?
                <>
                  <span className={style.label}>{t('expired_date')}:</span>
                  {getDate(data.expire)}
                </>
              :
                <>
                  <span className={style.label}>{t('username')}:</span>
                  {data.username}
                </>
            }
          </span>
          {
            isPaid &&
            <h4 className={style.status}>{t('voucher_status.paid')}</h4>
          }
        </span>
      </div>
    </div>
  )
}

export default Voucher
