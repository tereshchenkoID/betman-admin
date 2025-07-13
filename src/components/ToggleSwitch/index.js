import React from 'react'

import classNames from 'classnames'

import styles from './index.module.scss'

const ToggleSwitch = ({ isOn, handleToggle, label }) => {
  return (
    <div className={styles.toggle}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={classNames(styles.switch, { [styles.on]: isOn })} onClick={handleToggle}>
        <div className={styles.knob} />
      </div>
    </div>
  )
}

export default ToggleSwitch
