import { useAuthStore } from 'stores/authStore'

import { useBreakpoints } from 'hooks/useBreakpoints'

import Clock from './Clock'
import Language from './Language'
import Account from './Account'
import Theme from 'modules/Theme'

import style from './index.module.scss'

const Header = () => {
  const { auth } = useAuthStore()
  const bp = useBreakpoints()

  return (
    <header className={style.block}>
      {
        bp.bp768 &&
        <Clock />
      }
      {
        (auth?.unlimited_balance !== '1' && auth?.credits) &&
        <div className={style.balance}>
          {
            Object.entries(auth?.credits).map(([key, value]) =>
              <p key={key}>
                <strong>{value}</strong> <span>{key}</span>
              </p>
            )
          }
        </div>
      }
      {
        bp.bp1280 &&
        <>
          <Theme />
          <Language />
        </>
      }
      <Account />
    </header>
  )
}

export default Header
