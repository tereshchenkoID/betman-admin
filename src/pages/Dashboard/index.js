import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {
  Chart as ChartJS,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from 'chart.js'

import {getData, postData} from 'hooks/useRequest'

import Debug from 'modules/Debug'
import Button from 'components/Button'
import Paper from 'components/Paper'

import style from './index.module.scss'
import PlayersTable from "./PlayersTable";
import Field from "../../components/Field";

ChartJS.register(
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

const users = [
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
  const { agents } = useSelector(state => state.agents)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [players, setPlayers] = useState([])

  const initialValue = {
    agent: {
      id: agents[0].id,
      username: agents[0].username,
    },
    playerID: '',
  }

  const [filter, setFilter] = useState(initialValue)

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleSubmit = event => {
    event && event.preventDefault()
    const formData = new FormData()

    formData.append('playerID', filter.playerID)

    postData('dashboard/', formData).then(json => {
      if (json.status === 'OK') {
        setData(json.data)
        loading && setLoading(false)
      }
    })
  }

  useEffect(() => {
    getData('/json/players.json').then(data => {
      if (!data.error) {
        setPlayers(data)
      } else {
        console.error('Failed to load players:', data.message)
      }
    })
  }, [])

  useEffect(() => {
    handleSubmit()

    const interval = setInterval(() => {
      handleSubmit()
    }, 60000)

    return () => clearInterval(interval)
  }, [filter])

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
                data={filter['playerID']}
                onChange={value => handlePropsChange('playerID', value)}
              />
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
        </form>
      </Paper>
      <PlayersTable data={users} />;
    </div>
  )
}

export default Dashboard
