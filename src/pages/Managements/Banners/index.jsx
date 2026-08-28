import { useParams } from 'react-router-dom'

import Edit from './Edit'
import List from './List'

const Banners = () => {
  const { banner } = useParams()

  return (
    banner ? <Edit id={banner} /> : <List />
  )
}

export default Banners
