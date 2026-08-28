import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { NAVIGATION, REQUEST_TYPE, service } from 'constant/config'

import { useSettingsStore } from 'stores/settingsStore'
import { useAsideStore } from 'stores/asideStore'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
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

const INITIAL_FILTER = { q: '', type: -1, status: -1, agent: -1 }

const List = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { request, loading } = useApi()
  const { settings } = useSettingsStore()
  const { setAside } = useAsideStore()

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

      await request(REQUEST_TYPE.POST, 'bonus/delete', formData)
      handleSubmit(null, data?.pagination?.page)
    }
    setAside(null)
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
      type: nextFilter.type,
      status: nextFilter.status,
      agent: nextFilter.agent,
    })

    setData(await request(REQUEST_TYPE.POST, 'bonuses/', formData))
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
        current={{text: NAVIGATION.managements.bonuses.text}}
      />
      <Paper
        headline={t(NAVIGATION.managements.bonuses.text)}
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
            <CustomSelect
              placeholder={t('type')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...convertOptions(settings.bonuses.types, t)
              ]}
              data={filter['type']}
              onChange={value => handlePropsChange('type', value)}
            />
            <CustomSelect
              placeholder={t('status')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...convertOptions(settings.bonuses.statuses, t)
              ]}
              data={filter['status']}
              onChange={value => handlePropsChange('status', value)}
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
              to={`${NAVIGATION.managements.bonuses.link}/add`}
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
            <div className={style.cell}>{t('title')}</div>
            <div className={style.cell}>{t('agent')}</div>
            <div className={style.cell}>{t('budget')}</div>
            <div className={style.cell}>{t('type')}</div>
            <div className={style.cell}>{t('status')}</div>
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
                      clsx(
                        style.row,
                        el.status === '0' && style.hidden
                      )
                    }
                  >
                    <div className={style.cell}>{el.id}</div>
                    <div className={style.cell}>{el.title}</div>
                    <div className={style.cell}>{el.agent?.username || t('all')}</div>
                    <div className={style.cell}>{el.budget} {el.currency}</div>
                    <div className={style.cell}>{t(settings.bonuses.types[el.type])}</div>
                    <div className={style.cell}>{t(settings.bonuses.statuses[el.status])}</div>
                    <div className={style.cell}>
                      <Icon
                        icon="fa-pencil"
                        alt="edit"
                        action={() => navigate(`${NAVIGATION.managements.bonuses.link}/${el.id}`)}
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
