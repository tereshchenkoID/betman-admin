import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { NAVIGATION, REQUEST_TYPE, service } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useFilterState } from 'hooks/useFilterState'
import { convertOptions } from 'helpers/convertOptions'
import { buildFormData } from 'helpers/buildFormData'

import Icon from 'components/Icon'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import CustomSelect from 'components/Select'
import Loader from 'components/Loader'
import Pagination from 'modules/Pagination'
import Breadcrumbs from 'modules/Breadcrumbs'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const INITIAL_FILTER = {
  q: '',
  visibility: -1,
}

const List = () => {
  const { t } = useTranslation()
  const { request, loading } = useApi()
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(service.QUANTITY[20])

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    handleSubmit(null, 0, INITIAL_FILTER)
  }

  const handleChange = async (el) => {
    const formData = buildFormData({ ...el, visibility: el.visibility === '0' ? '1' : '0' })

    await request(REQUEST_TYPE.POST, 'modules/edit/', formData)
    handleSubmit(null, data?.pagination?.page)
  }

  const handleSubmit = useCallback(async (e, page = 0, nextFilter = filter) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      agent: nextFilter.agent,
      visibility: nextFilter.visibility
    })

    setData(await request(REQUEST_TYPE.POST, 'modules/', formData))
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
        current={{text: NAVIGATION.managements.modules.text}}
      />
      <Paper
        headline={t(NAVIGATION.managements.modules.text)}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={filter}/>
        <form onSubmit={(e) => handleSubmit(e, 0)}>
          <div className={style.grid}>
            <Field
              type='text'
              placeholder={t('alias')}
              data={filter['q']}
              onChange={value => handlePropsChange('q', value)}
            />
            <CustomSelect
              placeholder={t('visibility')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...convertOptions(service.YES_NO, t)
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
            <div className={style.cell}>{t('alias')}</div>
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
                    className={
                      clsx(
                        style.row,
                        el.visibility === '0' && style.hidden
                      )
                    }
                  >
                    <div className={style.cell}>{el.id}</div>
                    <div className={style.cell}>{el.title}</div>
                    <div className={style.cell}>{el.slug}</div>
                    <div className={style.cell}>
                      <Icon
                        classes={['warning']}
                        icon={el.visibility === '0' ? 'fa-eye-slash' : 'fa-eye'}
                        alt="visibility"
                        action={() => handleChange(el)}
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
