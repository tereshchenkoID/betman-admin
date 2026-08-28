import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Challenges = () => {
  const { challenge } = useParams()

  return (
    challenge ? <Edit id={challenge} /> : <List />
  )
}

export default Challenges
