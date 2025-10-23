import React from 'react'
import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Notifications = () => {
  const { notification } = useParams()

  return (
    notification ? <Edit id={notification} /> : <List />
  )
}

export default Notifications
