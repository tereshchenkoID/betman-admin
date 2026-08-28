import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Quests = () => {
  const { quest } = useParams()

  return (
    quest ? <Edit id={quest} /> : <List />
  )
}

export default Quests
