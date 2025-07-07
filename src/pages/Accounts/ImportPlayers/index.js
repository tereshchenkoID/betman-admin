import React from 'react'
import { useTranslation } from 'react-i18next'

import style from './index.module.scss'

const ImportPlayers = ({ data }) => {
  const { t } = useTranslation()

  const handleSubmit = e => {
    e.preventDefault()
  }

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <h6>
        {t('import_players_text_1')}
      </h6>
      <h6>
        {t('import_players_text_2')}
      </h6>
      <h6>
        {t('example')}
      </h6>
      <pre>
        {t('example_text')}
      </pre>
    </form>
  )
}

export default ImportPlayers
