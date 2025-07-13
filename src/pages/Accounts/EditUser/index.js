import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import { types } from 'constant/config'

import { postData } from 'hooks/useRequest'

import General from './General'
import Websites from './Websites'
import Bonuses from './Bonuses'
import Jackpots from './Jackpots'

import style from './index.module.scss'

const getContent = (active, data, inherit, setUpdate) => {
  switch (active) {
    case 0:
      return <General data={data} inherit={inherit} setUpdate={setUpdate} />
    case 1:
      return <Websites data={data} inherit={inherit} setUpdate={setUpdate} />
    case 2:
      return <Bonuses data={data} inherit={inherit} setUpdate={setUpdate} />
    case 3:
      return <Jackpots data={data} inherit={inherit} setUpdate={setUpdate} />
    default:
      return null
  }
}

const EditAgent = ({ data }) => {
  const { t } = useTranslation()
  const { auth } = useSelector(state => state.auth)
  const [active, setActive] = useState(0)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inherit, setInherit] = useState()
  const [update, setUpdate] = useState(true)
  const isAdmin = auth.type === types.ACCOUNT_TYPE.Admin

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
        // setInherit(json.data.general.inherit)
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
        <button
          className={classNames(style.link, active === 0 && style.active)}
          onClick={() => setActive(0)}
        >
          {t('general')}
        </button>
        <button
          className={classNames(style.link, active === 1 && style.active)}
          onClick={() => setActive(1)}
        >
          {t('websites')}
        </button>
        <button
          className={classNames(style.link, active === 2 && style.active)}
          onClick={() => setActive(2)}
        >
          {t('bonuses')}
        </button>
        <button
          className={classNames(style.link, active === 3 && style.active)}
          onClick={() => setActive(3)}
        >
          {t('jackpots')}
        </button>
      </div>
      <div className={style.body}>
        {!loading &&
          getContent(
            active,
            {
              ...info,
              type: data.type,
            },
            inherit,
            setUpdate,
          )}
      </div>
    </div>
  )
}

export default EditAgent
