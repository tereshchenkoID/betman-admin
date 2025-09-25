import React from 'react'

import Providers from 'modules/Providers'

const Games = ({ filter, setFilter }) => {

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <Providers
      providersSelected={filter.providers}
      gamesSelected={filter.games}
      onChange={(field, value) => handlePropsChange(field, value)}
    />
  )
}

export default Games
