import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { NAVIGATION, REQUEST_TYPE, service } from 'src/constant/config'

import { useAsideStore } from 'src/stores/asideStore'
import { useApi } from 'src/hooks/useApi'
import { useFilterState } from 'src/hooks/useFilterState'
import { useOptions } from 'src/hooks/useOptions'
import { getDate } from 'src/helpers/getDate'
import { buildFormData } from 'src/helpers/buildFormData'

import Icon from 'components/Icon'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Reference from 'components/Reference'
import Loader from 'components/Loader'
import CustomSelect from 'components/Select'
import Pagination from 'modules/Pagination'
import Breadcrumbs from 'modules/Breadcrumbs'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const INITIAL_FILTER = {
  q: '',
  agent: -1,
  'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
  'date-to': getDate(new Date(), 'datetime-local'),
}

const List = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { request, loading } = useApi()
  const { setAside } = useAsideStore()
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(service.QUANTITY[20])

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    handleSubmit(null, 0, INITIAL_FILTER)
  }

  const handleDelete = async (type, el) => {
    if (type === 1) {
      const formData = buildFormData({ id: el.id })
      await request(REQUEST_TYPE.POST, 'wheel/data/delete', formData)
      handleSubmit(null, data?.pagination?.page)
    }
    setAside(null)
  }

  const handleChange = async (el) => {
    const formData = buildFormData({ ...el, visibility: el.visibility === '0' ? '1' : '0' })

    await request(REQUEST_TYPE.POST, 'wheel/data/edit', formData)
    handleSubmit(null, data?.pagination?.page)
  }

  const handleConfirmed = (e, el) => {
    setAside({
      meta: {
        title: t('notification.delete_confirmed'),
        cmd: 'confirmed',
        buttonRef: e.target,
      },
      action: (type) => handleDelete(type, el),
    })
  }

  const handleSubmit = useCallback(async (e, page = 0, nextFilter = filter) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      agent: nextFilter.agent,
      'date-from': nextFilter['date-from'],
      'date-to': nextFilter['date-to']
    })

    setData(await request(REQUEST_TYPE.POST, 'wheel/', formData))
  }, [filter, quantity])

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  return (
    <>
      <Breadcrumbs
        data={[
          NAVIGATION.home,
        ]}
        current={{text: NAVIGATION.managements.wheels.text}}
      />
      <Paper
        headline={t(NAVIGATION.managements.wheels.text)}
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
              placeholder={t('agent')}
              options={agentsOptions}
              data={filter.agent}
              onChange={value => handlePropsChange('agent', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('date_from')}
              data={filter['date-from']}
              onChange={value => handlePropsChange('date-from', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('date_to')}
              data={filter['date-to']}
              onChange={value => handlePropsChange('date-to', value)}
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
              to={`${NAVIGATION.managements.wheels.link}/add`}
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
            <div className={style.cell}>{t('agent')}</div>
            <div className={style.cell}>{t('title')}</div>
            <div className={style.cell}>{t('date_created')}</div>
            <div className={style.cell} />
          </div>
          {
            data.data?.length === 0
              ?
                <div className={style.row}>
                  <div
                    className={style.empty}
                    style={{ gridColumn: 'span 5' }}
                  >
                    {t('notification.no_matching_records_found')}
                  </div>
                </div>
              :
                data?.data?.map((el, idx) =>
                  <div
                    key={idx}
                    className={style.row}
                  >
                    <div className={style.cell}>{el.id}</div>
                    <div className={style.cell}>{el.agent?.username || t('all')}</div>
                    <div className={style.cell}>{el.title}</div>
                    <div className={style.cell}>{getDate(el.date_created, 'datetime')}</div>
                    <div className={style.cell}>
                      <Icon
                        icon="fa-pencil"
                        alt="edit"
                        action={() => navigate(`${NAVIGATION.managements.wheels.link}/${el.id}`)}
                      />
                      <Icon
                        classes={['warning']}
                        icon={el.visibility === '0' ? 'fa-eye-slash' : 'fa-eye'}
                        alt="visibility"
                        action={() => handleChange(el)}
                      />
                      <Icon
                        classes={['error']}
                        icon="fa-trash"
                        alt="delete"
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
