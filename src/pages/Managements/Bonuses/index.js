import React from 'react'
import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Bonuses = () => {
  const { bonus } = useParams()

  return (
    bonus ? <Edit id={bonus} /> : <List />
  )
}

export default Bonuses
