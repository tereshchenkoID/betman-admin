import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import { postData } from 'hooks/useRequest'

import General from './General'
import Loby from './Loby'
import Websites from './Websites'
import Bonuses from './Bonuses'
import Jackpots from './Jackpots'

import style from './index.module.scss'

const getContent = (active, data, inherit, setUpdate) => {
  switch (active) {
    case 0:
      return <General data={data} inherit={inherit} setUpdate={setUpdate} />
    case 1:
      return <Loby data={data} inherit={inherit} setUpdate={setUpdate} />
    case 2:
      return <Websites data={data} inherit={inherit} setUpdate={setUpdate} />
    case 3:
      return <Bonuses data={data} inherit={inherit} setUpdate={setUpdate} />
    case 4:
      return <Jackpots data={data} inherit={inherit} setUpdate={setUpdate} />
    default:
      return null
  }
}

const TABS = [
  'general',
  'loby',
  'websites',
  'bonuses',
  'jackpots'
]

const ShopEdit = ({ data }) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [update, setUpdate] = useState(true)

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)

    postData('account_details/', formData).then(json => {
      if (json.status === 'OK') {
        const response = json.data
        response.id = data.id
        response.username = data.username

        setInfo(response)
        setLoading(false)
        setUpdate(false)
      }
    })
  }

  useEffect(() => {
    if (update) {
      handleSubmit()
    }
  }, [update])

  return (
    <div className={style.block}>
      <div className={style.header}>
        {
          TABS.map((el, idx) =>
            <button
              key={idx}
              className={
                classNames(
                  style.link,
                  active === idx && style.active
                )
              }
              onClick={() => setActive(idx)}
            >
              {t(el)}
            </button>
          )
        }
      </div>
      <div className={style.body}>
        {
          !loading &&
          getContent(
            active,
            {
              ...info,
              type: data.type,
            },
            setUpdate,
          )
        }
      </div>
    </div>
  )
}

export default ShopEdit
