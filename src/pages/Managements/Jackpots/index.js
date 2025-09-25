import React from 'react'
import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Jackpots = () => {
  const { jackpot } = useParams()

  return (
    jackpot ? <Edit id={jackpot} /> : <List />
  )
}

export default Jackpots
