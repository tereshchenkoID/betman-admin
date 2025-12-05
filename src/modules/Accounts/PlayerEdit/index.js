import React, { useState, Suspense, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import { REQUEST_TYPE } from 'constant/config'

import { useCmdStore } from 'stores/cmdStore'
import { useApi } from 'hooks/useApi'

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

const PlayerEdit = ({ mock }) => {
  const { t } = useTranslation()
  const { request, loading } = useApi()
  const { setCmd } = useCmdStore()
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState(null)

  const ActiveComponent = TABS[active].component

  const handleLoad = async (key = TABS[active].key) => {
    const { data, error } = await request(REQUEST_TYPE.GET, `player/edit/${key}/${mock?.id}`)

    if (!error) {
      setFilter(data)
    }
  }

  const handleSubmit = async (e, key = TABS[active].key) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, `player/edit/${key}/${mock?.id}`, formData)

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
                classNames(
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
                    data={{ key: TABS[active].key }}
                    filter={filter}
                    setFilter={setFilter}
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

export default PlayerEdit
