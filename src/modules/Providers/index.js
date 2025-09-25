import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { REQUEST_TYPE } from 'constant/config'
import { useApi } from 'hooks/useApi'

import Checkbox from 'components/Checkbox'
import Field from 'components/Field'

import style from './index.module.scss'

const Providers = ({ providersSelected, gamesSelected, onChange }) => {
  const { t } = useTranslation()
  const { request } = useApi()

  const [providers, setProviders] = useState([])
  const [games, setGames] = useState({})
  const [providerSearch, setProviderSearch] = useState('')
  const [gameSearch, setGameSearch] = useState('')

  const handleLoadProvider = async () => {
    const res = await request(REQUEST_TYPE.GET, 'providers/')
    setProviders(res?.data || [])
  }

  const handleLoadGames = async (provId) => {
    if (!games[provId]) {
      const res = await request(REQUEST_TYPE.GET, `games/${provId}/`)
      if (res?.data) {
        setGames(prev => ({
          ...prev,
          [provId]: res.data
        }))
      }
    }
  }

  const handleProvider = async (id, checked) => {
    if (checked) {
      onChange('providers', [...providersSelected, id])
      await handleLoadGames(id)
    } else {
      onChange('providers', providersSelected.filter(p => p !== id))

      const removedGames = (games[id] || []).map(g => g.id)
      onChange('games', gamesSelected.filter(gid => !removedGames.includes(gid)))

      setGames(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })
    }
  }

  const handleGame = (id, checked) => {
    onChange(
      'games',
      checked
        ? [...gamesSelected, id]
        : gamesSelected.filter(g => g !== id)
    )
  }

  useEffect(() => {
    handleLoadProvider()
  }, [])

  useEffect(() => {
    const loadSelectedProvidersGames = async () => {
      for (const provId of providersSelected) {
        if (!games[provId]) {
          await handleLoadGames(provId)
        }
      }
    }
    if (providersSelected.length > 0) {
      loadSelectedProvidersGames()
    }
  }, [])

  const filteredProviders = providers.filter(el =>
    el.title.toLowerCase().includes(providerSearch.toLowerCase())
  )

  const filteredGames = Object.entries(games).reduce((acc, [provId, provGames]) => {
    const matchedGames = provGames.filter(game =>
      game.name.toLowerCase().includes(gameSearch.toLowerCase())
    )
    if (matchedGames.length > 0) acc[provId] = matchedGames
    return acc
  }, {})

  return (
    <div className={style.block}>
      <div className={style.column}>
        <p className={style.subtitle}>
          {t('providers')} <strong>{providersSelected.length} / {providers.length}</strong>
        </p>
        <Field
          type={'text'}
          classes={['sm']}
          placeholder={t('search')}
          data={providerSearch}
          onChange={setProviderSearch}
        />
        <div className={style.list}>
          {
            filteredProviders.map(el => (
              <Checkbox
                key={el.id}
                placeholder={`${el.title} (${el.results})`}
                data={providersSelected.includes(el.id) ? '1' : '0'}
                onChange={val => handleProvider(el.id, val === '1')}
              />
            ))
          }
        </div>
      </div>

      <div className={style.column}>
        <p className={style.subtitle}>
          {t('games')} <strong>{gamesSelected.length} / {Object.values(games).flat().length}</strong>
        </p>
        <Field
          type={'text'}
          classes={['sm']}
          placeholder={t('search')}
          data={gameSearch}
          onChange={setGameSearch}
        />
        <div className={style.list}>
          {
            Object.entries(filteredGames).map(([provId, provGames]) =>
              <React.Fragment key={provId}>
                {
                  provGames.map(game => (
                    <Checkbox
                      key={game.id}
                      placeholder={game.name}
                      data={gamesSelected.includes(game.id) ? '1' : '0'}
                      onChange={val => handleGame(game.id, val === '1')}
                    />
                  ))
                }
              </React.Fragment>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Providers
