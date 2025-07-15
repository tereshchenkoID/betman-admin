import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Debug from 'modules/Debug'
import Agents from 'modules/Agents'
import Table from './Table'

import style from './index.module.scss'

const DATA = [
  {
    "id": "1000",
    "parent_id": "1",
    "username": "austin",
    "full_name": "Austin Test",
    "locked": "0",
    "currency": "USD",
    "credits": {
      "ETB": "999827582.68",
      "KES": "184306557.00",
      "NGN": "100000000.00",
      "SSP": "96500000.00",
      "UGX": "90000000.00",
      "USD": "99314641.38"
    },
    "commission": {
      "ETB": "0.00",
      "KES": "0.00",
      "NGN": "0.00",
      "SSP": "0.00",
      "UGX": "0.00",
      "USD": "0.00"
    },
    "subagent": [
      {
        "id": "1017171",
        "parent_id": "1000",
        "username": "subagent_1",
        "full_name": "Subagent 1",
        "locked": "0",
        "credits": {
          "KES": "55000.00"
        },
        "commission": {
          "KES": "0.00"
        },
        "currency": "KES",
        "shops": [
          {
            "id": "1017175",
            "parent_id": "1017171",
            "username": "shop 1",
            "full_name": "",
            "locked": "0",
            "credits": {
              "KES": "20195.15"
            },
            "currency": "KES",
            "commission": {
              "KES": "0.00"
            },
            "players": [
              {
                "id": "10171752",
                "parent_id": "1017175",
                "username": "test_player",
                "full_name": "Test Player",
                "email": "test@mail.com",
                "phone": "+380343434",
                "create": "1752507842984",
                "currency": "KES",
                "credits": {
                  "KES": "20195.15"
                },
              },
              {
                "id": "10171752",
                "parent_id": "1017175",
                "username": "test_player_2",
                "full_name": "Test Player 2",
                "email": "test@mail.com",
                "phone": "+380343434",
                "create": "1752507842984",
                "currency": "KES",
                "credits": {
                  "KES": "184306557.00"
                },
              }
            ],
            "cashiers": [
              {
                "id": "44532123",
                "parent_id": "1017175",
                "username": "test_cashier",
                "full_name": "Test cashier",
                "locked": "0",
                "currency": "KES",
                "credits": {
                  "KES": "20195.15",
                  "NGN": "100000000.00",
                  "SSP": "96500000.00",
                  "UGX": "90000000.00",
                  "USD": "99314641.38"
                },
              }
            ]
          },
          {
            "id": "1017177",
            "parent_id": "1017171",
            "username": "shop 2",
            "full_name": "",
            "locked": "0",
            "credits": {
              "KES": "99800.00"
            },
            "currency": "KES",
            "commission": {
              "KES": "0.00"
            },
            "players": [],
            "cashiers": []
          }
        ]
      },
      {
        "id": "1017172",
        "parent_id": "1000",
        "username": "subagent_2",
        "full_name": "Subagent 2",
        "locked": "0",
        "credits": {
          "KES": "5000.00"
        },
        "commission": {
          "KES": "0.00"
        },
        "currency": "KES",
        "shops": []
      }
    ]
  }
]

const config_1 = [
  {
    key: 'username',
    text: 'username',
  },
  {
    key: 'full_name',
    text: 'full_name',
  },
  {
    key: 'credits',
    text: 'credits',
  },
  {
    key: 'commission',
    text: 'commission',
  },
  {
    key: 'currency',
    text: 'currency',
  },
  {
    key: 'locked',
    text: 'locked',
  },
]

const config_2 = [
  {
    key: 'id',
    text: 'id',
  },
  {
    key: 'username',
    text: 'username',
  },
  {
    key: 'full_name',
    text: 'full_name',
  },
  {
    key: 'email',
    text: 'email',
  },
  {
    key: 'phone',
    text: 'phone',
  },
  {
    key: 'credits',
    text: 'credits',
  },
  {
    key: 'currency',
    text: 'currency',
  },
  {
    key: 'create',
    text: 'create',
  },
]

const config_3 = [
  {
    key: 'id',
    text: 'id',
  },
  {
    key: 'username',
    text: 'username',
  },
  {
    key: 'full_name',
    text: 'full_name',
  },
  {
    key: 'credits',
    text: 'credits',
  },
  {
    key: 'currency',
    text: 'currency',
  }
]

const Accounts = () => {
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)
  const [search, setSearch] = useState(false)

  const initialValue = {
    'agent': {
      'id': agents[0].id,
      'username': agents[0].username,
    }
  }
  const [filter, setFilter] = useState(initialValue)
  const [data, setData] = useState(agents)

  const handleSubmit = event => {
    event && event.preventDefault()
    setData(searchFilter(agents[0]))
    setSearch(true)
  }

  const searchFilter = node => {
    const s = {
      id: node.id,
    }
    const t = {
      id: filter.agent.id,
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
    setSearch(false)
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  useEffect(() => {
    if (search) {
      setData(searchFilter(agents[0]))
    } else {
      setData(agents)
    }
  }, [agents])

  return (
    <>
      <Paper headline={t('account_search')} classes={['sm']}>
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
      <Paper>
        <Table
          data={DATA}
          filter={filter}
          config_1={config_1}
          config_2={config_2}
          config_3={config_3}
          handleDataChange={setData}
        />
      </Paper>
    </>
  )
}

export default Accounts
