import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import { types } from 'constant/config'

import { postData } from 'hooks/useRequest'

import Checkbox from 'components/Checkbox'
import Business from './Business'
import Currency from './Currency'
import General from './General'
import Shop from './Shop'
import Logo from './Logo'
import Skin from './Skin'

import style from './index.module.scss'

const getContent = (active, data, inherit, setUpdate) => {
  switch (active) {
    case 0:
      return <General data={data} inherit={inherit} setUpdate={setUpdate} />
    case 1:
      return <Shop data={data} inherit={inherit} setUpdate={setUpdate} />
    case 2:
      return <Logo data={data} inherit={inherit} setUpdate={setUpdate} />
    case 3:
      return <Skin data={data} inherit={inherit} setUpdate={setUpdate} />
    case 4:
      return <Currency data={data} inherit={inherit} setUpdate={setUpdate} />
    case 5:
      return <Business data={data} inherit={inherit} setUpdate={setUpdate} />
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
        setInherit(json.data.general.inherit)
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
          {t('shop')}
        </button>
        {data.type !== types.TYPE[1] && (
          <>
            <button
              className={classNames(style.link, active === 2 && style.active)}
              onClick={() => setActive(2)}
            >
              {t('logo')}
            </button>
            {
              isAdmin &&
              <>
                <button
                  className={classNames(style.link, active === 3 && style.active)}
                  onClick={() => setActive(3)}
                >
                  {t('skin')}
                </button>
                <button
                  className={classNames(style.link, active === 4 && style.active)}
                  onClick={() => setActive(4)}
                >
                  {t('currency')}
                </button>
                <button
                  className={classNames(style.link, active === 5 && style.active)}
                  onClick={() => setActive(5)}
                >
                  {t('business')}
                </button>
              </>
            }
          </>
        )}
      </div>
      <div className={style.body}>
        <Checkbox
          data={inherit}
          onChange={value => {
            setInherit(value)
          }}
          placeholder={t('inherit')}
        />
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
