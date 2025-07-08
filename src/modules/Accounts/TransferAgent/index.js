import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'
import { setAgents } from 'store/actions/agentsAction'

import Field from 'components/Field'
import Button from 'components/Button'
import Agents from 'modules/Agents'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const TransferAgent = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)

  const initialValue = {
    id: data.id,
    username: data.username,
    agent: {
      id: agents[0].id,
      username: agents[0].username,
    },
  }
  const [filter, setFilter] = useState(initialValue)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', filter.id)
    formData.append('username', filter.username)
    formData.append('new-id', filter.agent.id)
    formData.append('new-username', filter.agent.username)

    postData(`transfer/`, formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        ).then(() => {
          handleResetForm()
          dispatch(setAside(null))
          dispatch(setAgents())
        })
      } else {
        dispatch(
          setToastify({
            type: 'error',
            text: json.error_message,
          }),
        )
      }
    })
  }

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter.username}
        onChange={value => handlePropsChange('username', value)}
        classes={['disabled']}
      />
      <Agents
        data={filter.agent}
        options={agents}
        placeholder={t('new_agent')}
        onChange={value => handlePropsChange('agent', value)}
      />
      <div className={style.actions}>
        <Button type={'submit'} classes={'primary'} placeholder={t('change')} />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default TransferAgent
