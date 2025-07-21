import React from 'react'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import Paper from 'components/Paper'
import Settings from "modules/Settings"

import style from './index.module.scss'

const checkCmd = data => {
  switch (data.meta.cmd) {
    case 'settings':
      return <Settings data={data} />
    default:
      return null
  }
}

const Aside = () => {
  const { aside } = useSelector(state => state.aside)

  return (
    <aside
      className={
        classNames(
          style.block,
          aside && style.active
        )
      }
    >
      {
        aside &&
        <div className={style.wrapper}>
          <Paper
            headline={aside.meta.title}
            classes={['transparent', 'sm']}
            quantity={false}
            close={true}
          >
            {checkCmd(aside)}
          </Paper>
        </div>
      }
    </aside>
  )
}

export default Aside
