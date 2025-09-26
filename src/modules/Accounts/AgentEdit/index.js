import React, { useState, Suspense, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'

import Button from 'components/Button'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const General = lazy(() => import('./General'))
const Websites = lazy(() => import('./Websites'))
const Bonuses = lazy(() => import('./Bonuses'))
const Jackpots = lazy(() => import('./Jackpots'))
const Games = lazy(() => import('./Games'))
const Security = lazy(() => import('./Security'))

const TABS = [
  { key: 'general', component: General },
  { key: 'websites', component: Websites },
  { key: 'providers', component: Games },
  { key: 'bonuses', component: Bonuses },
  { key: 'jackpots', component: Jackpots },
  { key: 'security', component: Security }
]

const AgentEdit = ({ data }) => {
  const { t } = useTranslation()
  const { request, loading } = useApi()
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState(null)

  const ActiveComponent = TABS[active].component

  const handleLoad = async (key = TABS[active].key) => {
    const json = await request(REQUEST_TYPE.GET, `agent/edit/${key}/${data?.id}`)
    setFilter(json?.data)
  }

  const handleSubmit = async (e, key = TABS[active].key) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const json = await request(REQUEST_TYPE.POST, `agent/edit/${key}/${data?.id}`, formData)
    setFilter(json?.data)
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
              onChange={handleLoad}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgentEdit
