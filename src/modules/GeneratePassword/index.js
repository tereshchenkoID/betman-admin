import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import Password from 'components/Password'

import style from './index.module.scss'

const GeneratePassword = ({
  data,
  action,
  list,
  filter,
  handlePropsChange,
}) => {
  const { t } = useTranslation()
  const [password, setPassword] = useState(false)

  const generatePassword = () => {
    const newData = data
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let newPassword = ''

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset.charAt(randomIndex)
    }

    list.forEach(el => (newData[el] = newPassword))

    action(() => ({
      ...newData,
    }))

    setPassword(newPassword)
  }

  return (
    <div className={style.block}>
      {list.map((el, idx) => (
        <Password
          key={idx}
          placeholder={t(el)}
          data={filter[el]}
          onChange={value => handlePropsChange(el, value)}
          password={password}
          required={true}
        />
      ))}
      <div className={style.actions}>
        <Button
          type={'button'}
          classes={'primary'}
          placeholder={t('generate_password')}
          onChange={() => {
            generatePassword()
          }}
        />
      </div>
    </div>
  )
}

export default GeneratePassword
