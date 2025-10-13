import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from 'components/Select'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'
import GeneratePassword from 'modules/GeneratePassword'

import style from './index.module.scss'

const PlacePlayer = ({ mock }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { settings } = useSelector(state => state.settings)
  const { request } = useApi()
  const [filter, setFilter] = useState(null)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleLoad = async () => {
    const { data, error } = await request(REQUEST_TYPE.GET, `player/add/general/${mock.agent?.id || mock.id || 0}`)

    if (!error) {
      setFilter(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, 'player/add/general/', formData)

    if (!error) {
      setFilter(data)
      dispatch(setAside(null))
    }
  }

  useEffect(() => {
    handleLoad()
  }, [])

  const { options: bonusesOptions } = useOptions(
    'bonuses_list/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  if (!filter) return <Loader type='content' />

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Field
        type={'text'}
        placeholder={t('name')}
        data={filter?.name}
        onChange={(e) => handlePropsChange('name', e)}
        isRequired={true}
      />
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter?.username}
        onChange={(e) => handlePropsChange('username', e)}
        isRequired={true}
      />
      <GeneratePassword
        list={['password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <div className={style.grid}>
        <Field
          type={'number'}
          placeholder={t('balance')}
          data={filter?.balance}
          onChange={(e) => handlePropsChange('balance', e)}
          isRequired={true}
        />
        <CustomSelect
          placeholder={t('currency')}
          options={[
            { value: -1, label: t('select_from_list') },
            ...Object.entries(settings?.currencies).map(([key, el], index) => ({
              value: key,
              label: el.text
            }))
          ]}
          isDisabled={true}
          data={filter?.currency}
          onChange={() => {}}
          isRequired={true}
        />
      </div>
      <CustomSelect
        placeholder={t('bonuses')}
        options={bonusesOptions}
        data={filter?.bonuses}
        onChange={value => handlePropsChange('bonuses', value)}
      />
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('create')}
        />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={() => handleLoad()}
        />
      </div>
    </form>
  )
}

export default PlacePlayer
