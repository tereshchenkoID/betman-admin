import React from 'react'
import { useTranslation } from 'react-i18next'

import Field from 'components/Field'
import Providers from 'modules/Providers'

import style from '../index.module.scss'

const RiskSpin = ({ data, action, active }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className={style.grid}>
        <Field
          type={'number'}
          placeholder={t('numbers')}
          data={data.numbers}
          onChange={value => action(`${active}.numbers`, value)}
          isRequired={true}
          min={0}
          max={100}
        />
        <Field
          type={'number'}
          placeholder={t('stake_level')}
          data={data.stake_level}
          onChange={value => action(`${active}.stake_level`, value)}
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
      <Providers
        providersUrl={'freespin_providers/'}
        providersSelected={data.providers}
        gamesSelected={data.games}
        onChange={(field, value) => action(`${active}.${field}`, value)}
      />
    </>
  );
};

export default RiskSpin;
