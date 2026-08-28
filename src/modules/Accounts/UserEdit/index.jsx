import { useState, Suspense, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { REQUEST_TYPE } from 'src/constant/config'

import { useCmdStore } from 'src/stores/cmdStore'
import { useApi } from 'src/hooks/useApi'
import { useFilterState } from 'src/hooks/useFilterState'

import Button from 'components/Button'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const General = lazy(() => import('./General'))
const Security = lazy(() => import('./Security'))

const TABS = [
  { key: 'general', component: General },
  { key: 'security', component: Security }
]

const UserEdit = ({ mock }) => {
  const { t } = useTranslation()
  const { request, loading } = useApi()
  const { setCmd } = useCmdStore()
  const [active, setActive] = useState(0)
  const { filter, setFilter, handlePropsChange } = useFilterState(null)

  const ActiveComponent = TABS[active].component

  const handleLoad = async (key = TABS[active].key) => {
    const { data, error } = await request(REQUEST_TYPE.GET, `user/edit/${key}/${mock?.id}`)

    if (!error) {
      setFilter(data)
    }
  }

  const handleSubmit = async (e, key = TABS[active].key) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, `user/edit/${key}/${mock?.id}`, formData)

    if (!error) {
      setFilter(data)
      setCmd('refresh-table')
    }
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return (
    <div className={style.block}>
      <div className={style.header}>
        {
          TABS.map((el, idx) =>
            <button
              key={idx}
              type="button"
              className={
                clsx(
                  style.link,
                  active === idx && style.active
                )
              }
              onClick={() => {
                setActive(idx)
                setFilter(null)
                handleLoad(TABS[idx].key)
              }}
            >
              {t(el.key)}
            </button>
          )
        }
      </div>

      <div className={style.body}>
        <Debug data={filter} />

        <form
          className={style.form}
          onSubmit={handleSubmit}
        >
          <Suspense fallback={<Loader type={'content'} />}>
            {
              (loading && !filter)
                ?
                  <Loader type="content" />
                :
                  <ActiveComponent
                    mock={mock}
                    data={{ key: TABS[active].key }}
                    filter={filter}
                    setFilter={setFilter}
                    handlePropsChange={handlePropsChange}
                  />
            }
          </Suspense>
          <div className={style.actions}>
            <Button
              type={'submit'}
              classes={['primary']}
              placeholder={t('save')}
            />
            <Button
              type={'reset'}
              placeholder={t('cancel')}
              onChange={() => handleLoad()}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserEdit
