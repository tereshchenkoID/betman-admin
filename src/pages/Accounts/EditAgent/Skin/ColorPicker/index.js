import React, { useState, useRef } from 'react'
import { useOutsideClick } from 'hooks/useOutsideClick'
import { SketchPicker } from 'react-color'

import classNames from 'classnames'

import Field from 'components/Field'

import style from './index.module.scss'

const ColorPicker = ({ data, isDisabled, onChange }) => {
  const [active, setActive] = useState(false)
  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  useOutsideClick(
    blockRef,
    () => {
      setActive(false)
    },
    {
      meta: {
        buttonRef: buttonRef,
      },
    },
  )

  const handleColorChange = (color) => {
    const { r, g, b, a } = color.rgb
    const newValue = a === 1 ? color.hex : `rgba(${r}, ${g}, ${b}, ${a})`
    
    onChange(newValue)
  }

  return (
    <div 
      className={
        classNames(
          style.block,
          isDisabled && style.disabled
        )
      }
      ref={blockRef}
    >
      <div className={style.wrapper}>
        <button
          type={'button'} 
          style={{
            background: data.value
          }}
          ref={buttonRef}
          aria-label={'Toggle color'}
          className={style.color} 
          onClick={() => setActive(!active)}
        />
        {
          active &&
          <div className={style.dropdown}>
            <SketchPicker 
              color={data.value}
              onChangeComplete={handleColorChange}
            />
          </div>
        }
      </div>
      <Field
        type={'text'}
        placeholder={data.label}
        data={data.value}
        onChange={(value) => onChange(value)}
        classes={[style.field]}
        min={4}
        max={7}
      />
    </div>
  )
}

export default ColorPicker
