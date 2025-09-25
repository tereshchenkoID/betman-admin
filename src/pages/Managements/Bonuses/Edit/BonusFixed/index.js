import React from 'react'
import { useTranslation } from 'react-i18next'

import Field from 'components/Field'

import style from '../index.module.scss'

const BonusFixed = ({ data, action, active }) => {
  const { t } = useTranslation()

  return (
   <div className={style.grid}>
     <Field
       type={'number'}
       placeholder={t('amount')}
       data={data.amount}
       onChange={value => action(`${active}.amount`, value)}
       isRequired={true}
       min={0}
       max={100}
     />
   </div>
  );
};

export default BonusFixed;
