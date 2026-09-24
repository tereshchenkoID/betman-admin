import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Eye, EyeOff } from 'lucide-react'

import style from './index.module.scss'

const Password = ({
  placeholder,
  data,
  onChange,
  classes = [],
  isRequired = false,
  password = false,
}) => {
  const [show, setShow] = useState(password)
  const inputRef = useRef(null)

  const onFocus = () => {
    inputRef.current.focus()
  }

  useEffect(() => {
    setShow(password)
  }, [password])

  return (
    <div
      className={
        clsx(
          style.block,
          classes && classes.map(el => style[el]),
        )
      }
    >
      <input
        ref={inputRef}
        className={style.input}
        type={show ? 'text' : 'password'}
        value={data}
        onChange={e => {
          onChange(e.currentTarget.value)
        }}
        required={isRequired}
      />
      <label className={style.label} onClick={onFocus}>
        {placeholder}
        {isRequired && <span>*</span>}
      </label>

      <button
        type={'button'}
        className={style.eye}
        onClick={() => setShow(!show)}
        aria-label={'Toggle field'}
      >
        {
          show
            ?
              <Eye size="20" />
            :
              <EyeOff size="20" />
        }
      </button>
    </div>
  )
}

export default Password
