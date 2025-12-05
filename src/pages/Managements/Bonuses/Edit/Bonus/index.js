import React from 'react'
import { useTranslation } from 'react-i18next'

import { useSettingsStore } from 'stores/settingsStore'

import Field from 'components/Field'
import CustomSelect from 'components/Select'

import style from '../index.module.scss'

const Bonus = ({ data, action, active }) => {
  const { t } = useTranslation()
  const { settings } = useSettingsStore()

  return (
   <div className={style.grid}>
     <Field
       type={'number'}
       placeholder={t('percentage')}
       data={data.percentage}
       onChange={value => action(`${active}.percentage`, value)}
       isRequired={true}
       min={0}
       max={100}
     />
     <CustomSelect
       placeholder={t('currency')}
       options={[
         { value: -1, label: t('select_from_list') },
         ...Object.entries(settings?.currencies).map(([key, el], index) => ({
           value: key,
           label: el.text
         }))
       ]}
       data={data.currency}
       onChange={value => action(`${active}.currency`, value)}
       isRequired={true}
     />
     <Field
       type={'number'}
       placeholder={t('max')}
       data={data.maximum}
       onChange={value => action(`${active}.max`, value)}
       isRequired={true}
       min={0}
     />
     <Field
       type={'number'}
       placeholder={t('wager')}
       data={data.wager}
       onChange={value => action(`${active}.wager`, value)}
       isRequired={true}
     />
   </div>
  );
};

export default Bonus;
