import React from 'react'

import classNames from 'classnames'

import styles from './index.module.scss'

const Toggle = ({ active, action }) => {
  return (
    <button
      className={classNames(styles.block, active && styles.active)}
      type={'button'}
      onClick={() => action(!active)}
      aria-label={'Toggle'}
      title={'Toggle'}
    >
      <div className={styles.line} />
      <div className={styles.line} />
      <div className={styles.line} />
    </button>
  )
}

export default Toggle
