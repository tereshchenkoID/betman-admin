import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Checkbox from "components/Checkbox"
import Field from 'components/Field'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const DATA = [
  {
    id: 0,
    name: 'casino',
    brands: [
      {
        id: 0,
        p_id: 0,
        name: 'Amatic',
        games: [
          {
            id: 0,
            p_id: 0,
            b_id: 0,
            name: 'Aliens',
          },
          {
            id: 1,
            p_id: 0,
            b_id: 0,
            name: 'Aloha! Cluster Pays',
          },
          {
            id: 1,
            p_id: 0,
            b_id: 0,
            name: 'American Roulette',
          }
        ]
      },
      {
        id: 1,
        p_id: 0,
        name: 'Apollo',
        games: [
          {
            id: 0,
            p_id: 0,
            b_id: 1,
            name: 'Arcane Reel Chaos',
          },
          {
            id: 1,
            p_id: 0,
            b_id: 1,
            name: 'Archangels: Salvation',
          },
          {
            id: 2,
            p_id: 0,
            b_id: 1,
            name: 'Asgardian Stones',
          }
        ]
      },
      {
        id: 2,
        p_id: 0,
        name: 'Austria',
        games: [
          {
            id: 0,
            p_id: 0,
            b_id: 2,
            name: 'Big Bang',
          },
          {
            id: 1,
            p_id: 0,
            b_id: 2,
            name: 'Black Jack 3 hands',
          }
        ]
      }
    ]
  }
]

const Game = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const initialValue = {
    providers: '0',
    brands: '0',
    game: '',
    data: DATA
  }

  const [search, setSearch] = useState('')

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

  // TODO change url
  const handleSubmit = e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)

    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData('lobby', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
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
    <>
      {/*<Debug data={filter} />*/}
      <form className={style.block} onSubmit={handleSubmit}>
        <div className={style.grid}>
          <div className={style.column}>
            <div className={style.head}>
              <Checkbox
                placeholder={t('providers')}
                data={filter.providers}
                onChange={value => handlePropsChange('providers', value)}
              />
              <Field
                placeholder={t('search')}
                data={search}
                classes={['sm']}
                onChange={value => setSearch(value)}
              />
            </div>
            <div className={style.body}>
              {
                filter.data?.map((el, idx) =>
                  <Checkbox
                    key={idx}
                    placeholder={el.name}
                    data={'0'}
                  />
                )
              }
            </div>
          </div>
          <div className={style.column}>
            <div className={style.head}>
              <Checkbox
                placeholder={t('brands')}
                data={filter.brands}
              />
              <Field
                placeholder={t('search')}
                data={search}
                classes={['sm']}
                onChange={value => setSearch(value)}
              />
            </div>
            <div className={style.body}>
              {
                filter.data?.map((el, _) =>
                  el.brands.map((el_b, idx) =>
                    <Checkbox
                      key={idx}
                      placeholder={el_b.name}
                      data={'0'}
                    />
                  )
                )
              }
            </div>
          </div>
          <div className={style.column}>
            <div className={style.head}>
              <Checkbox
                placeholder={t('game')}
                data={filter.game}
              />
              <Field
                placeholder={t('search')}
                data={search}
                classes={['sm']}
                onChange={value => setSearch(value)}
              />
            </div>
            <div className={style.body}>
              {
                filter.data?.map((el, _) =>
                  el.brands.map((el_b, _) =>
                    el_b.games.map((el_g, idx) =>
                      <Checkbox
                        key={idx}
                        placeholder={el_g.name}
                        data={'0'}
                      />
                    )
                  )
                )
              }
            </div>
          </div>
        </div>

        <div className={style.actions}>
          <Button
            type={'submit'}
            classes={['primary']}
            placeholder={t('save')}
          />
          <Button
            type={'reset'}
            placeholder={t('cancel')}
            onChange={handleResetForm}
          />
        </div>
      </form>
    </>
  )
}

export default Game
