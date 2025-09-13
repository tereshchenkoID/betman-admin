import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import { NAVIGATION, service } from 'constant/config'
import { convertOptions } from 'helpers/convertOptions'
import { postData } from 'helpers/api'
import { getDate } from 'helpers/getDate'

import Button from 'components/Button'
import Reference from 'components/Reference'
import Paper from 'components/Paper'
import Field from 'components/Field'
import Loader from 'components/Loader'
import CustomSelect from 'components/Select'
import Icon from 'components/Icon'
import Debug from 'modules/Debug'
import Pagination from 'modules/Pagination'

import style from './index.module.scss'

const DATA = {
  code: '0',
  pagination: {
    page: '0',
    pages: '4',
    quantity: '20'
  },
  data: [
    {
      id: 1,
      title: 'BONUS SPORT DE BUN VENIT',
      description: '100% până la 500 de lei, bonus cu rulaj 1x! E cea mai bună ofertă din România!',
      link: '/wiki/bonus-de-bun-venit-sport-500-lei-2025',
      button: {
        text: 'More',
        link: ['casino', 'promotions', '1']
      },
      badge: [
        'Online'
      ],
      visibility: 0,
      image: 'https://superbet-content.freetls.fastly.net/assets/97b4e39f-a4c7-4e46-b51e-52bb4fd0e12c?key=promotions-page',
      date: 1744873320000
    },
    {
      id: 2,
      title: 'BONUS CASINO DE BUN VENIT',
      description: '100% până la 500 de lei, bonus cu rulaj 1x! E cea mai bună ofertă din România!',
      link: '/wiki/bonus-de-bun-venit-casino-500-lei-2025',
      button: {
        text: 'More',
        link: ['casino', 'promotions', '1']
      },
      badge: [
        'Online'
      ],
      visibility: 1,
      image: 'https://superbet-content.freetls.fastly.net/assets/06babc96-ace1-45fa-a116-2b286ed28c17?key=promotions-page',
      date: 1744873320000
    }
  ]
}

const INITIAL_FILTER = { q: '', visibility: -1 }

const List = ({ onEdit, onDelete }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(DATA)
  const [quantity, setQuantity] = useState(20)
  const [filter, setFilter] = useState(INITIAL_FILTER)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    handleSubmit(null, 0)
  }

  const handleDelete = (id) => {

  }

  const handleChange = (id) => {

  }

  const handleSubmit = async (e, page = 0, nextFilter = filter) => {
    e && e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('page', page)
    formData.append('quantity', quantity)
    formData.append('q', nextFilter.q)
    formData.append('locked', nextFilter.locked)

    try {
      const json = await postData('agents/', formData)
      if (json?.code === '0') {
        setData(json)
      } else {
        console.error('Failed to load agents:', json?.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSubmit(null, 0)
  }, [quantity])

  return (
    <>
      <Paper
        headline={t('navigation.banners')}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={filter}/>
        <form onSubmit={(e) => handleSubmit(e, 0)}>
          <div className={style.grid}>
            <Field
              type='text'
              placeholder={t('title')}
              data={filter['q']}
              onChange={value => handlePropsChange('q', value)}
            />
            <CustomSelect
              placeholder={t('visibility')}
              options={[
                { value: -1, label: t('all') },
                ...convertOptions(service.YES_NO)
              ]}
              data={filter['visibility']}
              onChange={value => handlePropsChange('visibility', value)}
            />
          </div>
          <div className={style.actions}>
            <Button
              type={'submit'}
              classes={['primary']}
              placeholder={t('search')}
            />
            <Button
              type={'reset'}
              placeholder={t('cancel')}
              onChange={handleResetForm}
            />
          </div>
          <div className={style.actions}>
            <Reference
              to={`${NAVIGATION.managements.banners.link}/-1`}
              classes={['primary']}
              placeholder={t('add')}
            />
          </div>
        </form>
      </Paper>

      <Paper>
        {
          loading
            ?
              <Loader type={'content'} />
            :
              <>
                {
                  data?.pagination?.pages > 1 &&
                  <Pagination
                    position='top'
                    pagination={DATA?.pagination}
                    // handleSubmit={handleSubmit}
                  />
                }
                <div className={style.table}>
                  <div className={style.row}>
                    <div className={style.cell}>{t('id')}</div>
                    <div className={style.cell}>{t('image')}</div>
                    <div className={style.cell}>{t('title')}</div>
                    <div className={style.cell}>{t('description')}</div>
                    <div className={style.cell}>{t('category')}</div>
                    <div className={style.cell}>{t('date')}</div>
                    <div className={style.cell} />
                  </div>
                  {
                    DATA?.data.map((el, idx) =>
                      <div
                        key={idx}
                        className={
                          classNames(
                            style.row,
                            el.visibility === 0 && style.hidden
                          )
                        }
                      >
                        <div className={style.cell}>{el.id}</div>
                        <div className={style.cell}>
                          <img
                            src={el.image}
                            alt={el.title}
                            loading={'lazy'}
                            width={60}
                          />
                        </div>
                        <div className={style.cell}>{el.title}</div>
                        <div className={style.cell}>{el.subtitle}</div>
                        <div className={style.cell}>
                          {
                            el.badge?.map((badge, b_idx) =>
                              <p key={b_idx}>{badge}</p>
                            )
                          }
                        </div>
                        <div className={style.cell}>{getDate(el.date)}</div>
                        <div className={style.cell}>
                          <Icon
                            icon={el.visibility === 0 ? 'fa-eye-slash' : 'fa-eye'}
                            alt={t('visibility')}
                            action={() => handleChange(el.id)}
                          />
                          <Icon
                            icon='fa-pencil'
                            alt={t('edit')}
                            action={() => navigate(`${NAVIGATION.managements.promos.link}/${el.id}`)}
                          />
                          <Icon
                            icon='fa-trash'
                            alt={t('delete')}
                            action={() => handleDelete(el.id)}
                          />
                        </div>
                      </div>
                    )}
                </div>
                {
                  data?.pagination?.pages > 1 &&
                  <Pagination
                    position='bottom'
                    pagination={DATA?.pagination}
                    // handleSubmit={handleSubmit}
                  />
                }
              </>
        }
      </Paper>
    </>
  )
}

export default List
