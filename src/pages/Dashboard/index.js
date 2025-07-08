import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from "react-redux"

import { setAside } from 'store/actions/asideAction'

import Debug from 'modules/Debug'
import Button from 'components/Button'
import Paper from 'components/Paper'
import Field from "components/Field"
import PlayersTable from "./PlayersTable"

import style from './index.module.scss'

const DATA = [
  {
    id: 1,
    agent: 'Agent X',
    shop: 'Shop 1',
    username: 'jdoe',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+123456789',
    balance: 100.5,
    currency: 'USD',
    createdAt: '2025-06-21',
  },
  {
    id: 2,
    agent: 'Agent Y',
    shop: 'Shop 2',
    username: 'asmith',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+987654321',
    balance: -24.75,
    currency: 'EUR',
    createdAt: '2025-06-20',
  },
];

const Dashboard = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('')

  const handleSubmit = event => {
    event && event.preventDefault()
    // const formData = new FormData()
    //
    // formData.append('playerID', filter.playerID)
    //
    // postData('dashboard/', formData).then(json => {
    //   if (json.status === 'OK') {
    //     setData(json.data)
    //     loading && setLoading(false)
    //   }
    // })
  }

  const handleResetForm = () => {
    setFilter('')
  }

  useEffect(() => {
    setData(DATA)
    setLoading(false)
    // getData('/json/players.json').then(data => {
    //   if (!data.error) {
    //     setPlayers(data)
    //   } else {
    //     console.error('Failed to load players:', data.message)
    //   }
    // })
  }, [])

  const handleNewForm = (e, type, cmd) => {
    dispatch(
      setAside({
        meta: {
          title: t(type),
          cmd: cmd,
          buttonRef: e.target,
        },
        type: type,
        ...data,
      }),
    )
  }

  if (loading) return

  return (
    <div className={style.block}>
      <Paper headline={t('dashboard')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            <div>
              <Field
                type={'text'}
                placeholder={t('player_field_placeholder')}
                data={filter}
                onChange={value => setFilter(value)}
              />
            </div>
          </div>
          <div className={style.actions}>
            <Button
              type={'submit'}
              classes={'primary'}
              placeholder={t('search')}
            />
            <Button
              type={'reset'}
              placeholder={t('cancel')}
              onChange={handleResetForm}
            />
          </div>
          <div className={style.actions}>
            <Button
              type={'button'}
              placeholder={t('import_players')}
              onChange={e => handleNewForm(e, 'new-player', 'account-new-agent')}
            />
            <Button
              type={'button'}
              placeholder={t('create_voucher')}
              onChange={e => handleNewForm(e, 'create_voucher', 'account-create-voucher')}
            />
            <Button
              type={'button'}
              placeholder={t('create_agent')}
              onChange={e => handleNewForm(e, 'create_new_agent', 'account-new-agent')}
            />
          </div>
        </form>
      </Paper>
      <PlayersTable data={data} />
    </div>
  )
}

export default Dashboard
