import React from 'react'
import { useTranslation } from 'react-i18next'

import CustomSelect from 'components/Select'
import Providers from 'modules/Providers'

const Games = ({ filter, setFilter }) => {
  const { t } = useTranslation()

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <>
      <CustomSelect
        placeholder={t('all_games')}
        options={[{ value: -1, label: t('all_games')}, { value: 0, label: t('choose_games') }]}
        data={filter.all_games}
        onChange={value => {
          handlePropsChange('all_games', value)
          handlePropsChange('providers', [])
          handlePropsChange('games', [])
        }}
        isRequired={true}
      />
      {
        filter.all_games !== -1 &&
        <Providers
          providersSelected={filter.providers}
          gamesSelected={filter.games}
          onChange={(field, value) => handlePropsChange(field, value)}
        />
      }
    </>
  )
}

export default Games
