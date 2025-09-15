import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

import { NAVIGATION, REQUEST_TYPE, service } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { setAside } from 'store/actions/asideAction'
import { convertOptions } from 'helpers/convertOptions'
import { buildFormData } from 'helpers/buildFormData'

import Icon from 'components/Icon'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import CustomSelect from 'components/Select'
import Reference from 'components/Reference'
import Loader from 'components/Loader'
import Pagination from 'modules/Pagination'
import Breadcrumbs from 'modules/Breadcrumbs'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const INITIAL_FILTER = { q: '', visibility: -1 }

const List = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { request, loading } = useApi()
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(service.QUANTITY[20])
  const [filter, setFilter] = useState(INITIAL_FILTER)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    handleSubmit(null, 0, INITIAL_FILTER)
  }

  const handleDelete = async (type, el) => {
    if (type === 1) {
      const formData = buildFormData({ id: el.id })

      await request(REQUEST_TYPE.POST, 'banner/delete', formData)
      handleSubmit(null, data?.pagination?.page)
    }
    dispatch(setAside(null))
  }

  const handleConfirmed = (e, el) => {
    dispatch(
      setAside({
        meta: {
          title: t('notification.delete_confirmed'),
          cmd: 'confirmed',
          buttonRef: e.target,
        },
        action: (type) => handleDelete(type, el),
      }),
    )
  }

  const handleChange = async (el) => {
    const formData = buildFormData({ ...el, visibility: el.visibility === '0' ? '1' : '0' })

    await request(REQUEST_TYPE.POST, 'banner/edit', formData)
    handleSubmit(null, data?.pagination?.page)
  }

  const handleSubmit = useCallback(async (e, page = 0, nextFilter = filter) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      visibility: nextFilter.visibility
    })

    setData(await request(REQUEST_TYPE.POST, 'banners/', formData))
  }, [filter, quantity])

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  return (
    <>
      <Breadcrumbs
        data={[
          NAVIGATION.home,
        ]}
        current={{text: NAVIGATION.managements.banners.text}}
      />
      <Paper
        headline={t(NAVIGATION.managements.banners.text)}
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
              to={`${NAVIGATION.managements.banners.link}/add`}
              classes={['primary']}
              placeholder={t('add')}
            />
          </div>
        </form>
      </Paper>

      <Paper>
        {
          loading &&
          <Loader type={'loading'} />
        }
        <Pagination
          position='top'
          pagination={data.pagination}
          handleSubmit={handleSubmit}
        />
        <div className={style.table}>
          <div className={style.row}>
            <div className={style.cell}>{t('id')}</div>
            <div className={style.cell}>{t('image')}</div>
            <div className={style.cell}>{t('title')}</div>
            <div className={style.cell}>{t('subtitle')}</div>
            <div className={style.cell}>{t('description')}</div>
            <div className={style.cell}>{t('text')}</div>
            <div className={style.cell} />
          </div>
          {
            data.data?.length === 0
              ?
                <div className={style.row}>
                <div
                  className={style.empty}
                  style={{ gridColumn: 'span 7' }}
                >
                  {t('notification.no_matching_records_found')}
                </div>
              </div>
              :
                data?.data?.map((el, idx) =>
                  <div
                    key={idx}
                    className={
                      classNames(
                        style.row,
                        el.visibility === '0' && style.hidden
                      )
                    }
                  >
                    <div className={style.cell}>{el.id}</div>
                    <div className={style.cell}>
                      <div className={style.picture}>
                        {
                          el.image &&
                          <img
                            className={style.image}
                            src={el.image}
                            alt={el.title}
                            loading={'lazy'}
                            width={40}
                          />
                        }
                      </div>
                    </div>
                    <div className={style.cell}>{el.title}</div>
                    <div className={style.cell}>{el.subtitle}</div>
                    <div className={style.cell}>{el.description}</div>
                    <div className={style.cell}>{el.alt}</div>
                    <div className={style.cell}>
                      <Icon
                        icon={el.visibility === '0' ? 'fa-eye-slash' : 'fa-eye'}
                        alt={t('visibility')}
                        action={() => handleChange(el)}
                      />
                      <Icon
                        icon="fa-pencil"
                        alt={t('edit')}
                        action={() => navigate(`${NAVIGATION.managements.banners.link}/${el.id}`)}
                      />
                      <Icon
                        icon="fa-trash"
                        alt={t('delete')}
                        action={(e) => handleConfirmed(e, el)}
                      />
                    </div>
                  </div>
                )
          }
        </div>
        <Pagination
          position='bottom'
          pagination={data.pagination}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </>
  )
}

export default List;
