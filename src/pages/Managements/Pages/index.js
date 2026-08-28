import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Pages = () => {
  const { page } = useParams()

  return (
    page ? <Edit id={page} /> : <List />
  )
}

export default Pages
