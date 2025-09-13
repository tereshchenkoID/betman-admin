import React from 'react'
import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Promos = () => {
  const { promo } = useParams()

  return (
    promo ? <Edit id={promo} /> : <List />
  )
}

export default Promos
