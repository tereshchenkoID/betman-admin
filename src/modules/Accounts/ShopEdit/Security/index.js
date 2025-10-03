import React from 'react'

import GeneratePassword from 'modules/GeneratePassword'

const Security = ({ filter, setFilter }) => {
  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <GeneratePassword
      list={['new_password']}
      data={filter}
      action={setFilter}
      filter={filter}
      handlePropsChange={handlePropsChange}
    />
  )
}

export default Security
