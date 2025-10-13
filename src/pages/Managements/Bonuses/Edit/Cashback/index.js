import React from 'react'
import { useTranslation } from 'react-i18next'

import Field from 'components/Field'

import style from '../index.module.scss'

const Bonus = ({ data, action, active }) => {
  const { t } = useTranslation()

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
     <Field
       type={'number'}
       placeholder={t('min_loses')}
       data={data.min_loses}
       onChange={value => action(`${active}.min_loses`, value)}
       isRequired={true}
       min={0}
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
