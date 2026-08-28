import GeneratePassword from 'modules/GeneratePassword'

const Security = ({ filter, setFilter, handlePropsChange }) => {
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
