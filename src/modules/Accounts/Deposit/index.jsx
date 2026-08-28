import { useTranslation } from 'react-i18next'

import { ACCOUNT_TYPE, REQUEST_TYPE } from 'src/constant/config'

import { useAsideStore } from 'src/stores/asideStore'
import { useCmdStore } from 'src/stores/cmdStore'
import { useAuthStore } from 'src/stores/authStore'
import { useApi } from 'src/hooks/useApi'
import { useOptions } from 'src/hooks/useOptions'
import { useFilterState } from 'src/hooks/useFilterState'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from 'components/Select'
import Plate from 'components/Plate'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Deposit = ({ mock }) => {
  const { t} = useTranslation()
  const { request } = useApi()
  const { setAside } = useAsideStore()
  const { setCmd } = useCmdStore()
  const { auth, updateAuth } = useAuthStore()

  const INITIAL_FILTER = {
    id: mock.id,
    bonus: -1,
    credits: mock.credits,
    currency: -1,
    amount: '',
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const isValid = filter?.amount !== '' && Number(filter?.amount) > 0 && (
    auth.unlimited_balance === '1' || Number(filter?.amount) <= Number(auth.credits[filter?.currency])
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValid) return

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { credits, error } = await request(REQUEST_TYPE.POST, 'deposit/', formData)

    if (!error) {
      setAside(null)
      setCmd('refresh-table')

      if (credits) {
        updateAuth({credits})
      }
    }
  }

  const { options: bonusesOptions } = useOptions(
    `bonuses_list/${mock.id}`,
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter}/>
      <Field
        type={'text'}
        placeholder={t('id')}
        data={filter?.id}
        isRequired={true}
        isDisabled={true}
      />
      <CustomSelect
        placeholder={t('credits')}
        options={[
          {value: -1, label: t('select_from_list')},
          ...Object.entries(mock?.credits).map(([key, value]) => ({
            value: key,
            label: `${value} ${key}`
          }))
        ]}
        data={filter?.currency}
        onChange={value => {
          handlePropsChange('currency', value)
          handlePropsChange('amount', '')
        }}
        isRequired={true}
      />
      {
        filter?.currency !== -1 &&
        <>
          {
            auth.unlimited_balance !== '1' && Number(filter?.amount) > Number(auth.credits[filter?.currency]) &&
            <Plate data={t('notification.amount_greater_balance')} />
          }
          <Field
            type={'number'}
            placeholder={t('amount')}
            data={filter?.amount}
            onChange={value => handlePropsChange('amount', value)}
            isRequired={true}
          />
        </>
      }
      {
        mock.type === ACCOUNT_TYPE.PLAYER &&
        <CustomSelect
          placeholder={t('bonuses')}
          options={bonusesOptions}
          data={filter?.bonuses}
          onChange={value => handlePropsChange('bonuses', value)}
        />
      }
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('deposit')}
          isDisabled={!isValid}
        />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={() => setFilter(INITIAL_FILTER)}
        />
      </div>
    </form>
  )
}

export default Deposit
