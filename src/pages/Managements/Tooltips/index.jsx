import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Tooltips = () => {
  const { tooltip } = useParams()

  return (
    tooltip ? <Edit id={tooltip} /> : <List />
  )
}

export default Tooltips
