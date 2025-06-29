import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {getData, postData} from 'hooks/useRequest'

import Debug from 'modules/Debug'
import Button from 'components/Button'
import Paper from 'components/Paper'

import style from './index.module.scss'
import PlayersTable from "./PlayersTable";
import Field from "../../components/Field";

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
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState()

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
            <div className={style.actions}>
              <Button
                type={'submit'}
                classes={'primary'}
                placeholder={t('search')}
              />
              {/*<Button*/}
              {/*  type={'reset'}*/}
              {/*  placeholder={t('cancel')}*/}
              {/*  onChange={handleResetForm}*/}
              {/*/>*/}
            </div>
          </div>
          <div className={style.actions}>
            <Button
              type={'button'}
              placeholder={t('import_players')}
              onChange={() => alert(t('import_players'))}
            />
            <Button
              type={'button'}
              placeholder={t('create_voucher')}
              onChange={() => alert(t('create_voucher'))}
            />
            <Button
              type={'button'}
              placeholder={t('create')}
              onChange={() => alert(t('create'))}
            />
          </div>
        </form>
      </Paper>
      <PlayersTable data={data} />
    </div>
  )
}

export default Dashboard
