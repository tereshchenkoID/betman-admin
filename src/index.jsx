import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import './i18n'

import './scss/app.scss'

import { router } from './router'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router} />)
