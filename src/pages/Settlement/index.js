import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Debug from 'modules/Debug'
import Agents from 'modules/Agents'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Table from './Table'

import style from './index.module.scss'

const config_1 = [
  {
    key: 'username',
    text: 'username',
  },
  {
    key: 'full_name',
    text: 'full_name',
  },
]

const config_2 = [
  {
    key: 'shops',
    text: 'shops',
  },
]

const config_3 = [
  {
    key: 'date',
    text: 'date',
  },
  {
    key: 'number',
    text: 'num',
  },
  {
    key: 'currency',
    text: 'currency',
  },
  {
    key: 'total_in',
    text: 'total_in',
  },
  {
    key: 'total_out',
    text: 'total_out',
  },
  {
    key: 'total_open',
    text: 'total_open',
  },
  {
    key: 'jackpot_1',
    text: 'jackpot_1_payout',
  },
  {
    key: 'jackpot_2',
    text: 'jackpot_2_payout',
  },
  {
    key: 'jackpot_3',
    text: 'jackpot_3_payout',
  },
  {
    key: 'reversal',
    text: 'reversal',
  },
  {
    key: 'profit',
    text: 'profit',
  },
]

const Settlement = () => {
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)

  const initialValue = {
    agent: {
      id: agents[0].id,
      username: agents[0].username,
    },
  }
  const [filter, setFilter] = useState(initialValue)
  const [cmd, setCmd] = useState(false)
  const [data, setData] = useState(agents)

  const handleSubmit = event => {
    event && event.preventDefault()
    setData(searchFilter(agents[0], filter.agent.id))
    setCmd('submit')
  }

  const searchFilter = node => {
    const s = {
      id: node.id,
    }
    const t = {
      id: filter.agent.id,
    }

    if (filter.locked) {
      s.locked = Number(node.locked)
      t.locked = filter.locked
    }
    if (filter.currency) {
      s.currency = node.currency
      t.currency = filter.currency
    }

    if (JSON.stringify(s) === JSON.stringify(t)) {
      return [node]
    }

    if (node.clients) {
      let results = []
      for (const client of node.clients) {
        results = results.concat(searchFilter(client))
      }
      return results
    }

    return []
  }

  const handleResetForm = () => {
    setFilter(initialValue)
    setData(agents)
    setCmd('reset')
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <>
      <Paper headline={t('settlement')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.grid}>
            <div>
              <Agents
                data={filter.agent}
                options={agents}
                onChange={value => handlePropsChange('agent', value)}
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
      <Paper classes={['sm']}>
        <Table
          data={data}
          config_1={config_1}
          config_2={config_2}
          config_3={config_3}
          cmd={cmd}
          setCmd={setCmd}
          filter={filter}
        />
      </Paper>
    </>
  )
}

export default Settlement
