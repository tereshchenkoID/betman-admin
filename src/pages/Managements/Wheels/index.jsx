import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Wheels = () => {
  const { wheel } = useParams()

  return (
    wheel ? <Edit id={wheel} /> : <List />
  )
}

export default Wheels
