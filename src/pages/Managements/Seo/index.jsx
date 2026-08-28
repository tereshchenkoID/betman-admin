import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Seo = () => {
  const { seo } = useParams()

  return (
    seo ? <Edit id={seo} /> : <List />
  )
}

export default Seo
