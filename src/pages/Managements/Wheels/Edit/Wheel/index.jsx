import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import style from './index.module.scss'

const Wheel = ({ mock }) => {
  const { t } = useTranslation()
  const wheelRef = useRef(null)
  const OPTIONS = useMemo(() => ({
    angleStep: 360 / mock?.data?.length || 0,
  }), [mock])

  const COLORS = ['#2596BE', '#FF6A00', '#7C4DFF']

  const wheelBackground = useMemo(() => {
    let acc = 0

    const gradientParts = mock?.data.map((_, i) => {
      const color = COLORS[i % COLORS.length]

      const part = `${color} ${acc}deg ${acc + OPTIONS.angleStep}deg`
      acc += OPTIONS.angleStep
      return part
    })
    return { background: `conic-gradient(${gradientParts.join(', ')})` }
  }, [OPTIONS.angleStep])

  return (
    <div className={style.block}>
      <div className={style.indicator} />
      <div className={style.frame}>
        <div ref={wheelRef} className={style.wheel} style={wheelBackground}>
          {
            mock?.data?.map((sector, i) =>
              <React.Fragment key={i}>
                <div
                  className={style.amount}
                  style={{ transform: `rotate(${i * OPTIONS.angleStep + OPTIONS.angleStep / 2}deg)` }}
                >
                  <div className={style.label}>
                    <strong>{sector}</strong>
                    <span>{t('sector')} {i + 1}</span>
                  </div>
                </div>
                <div
                  className={style.line}
                  style={{ transform: `rotate(${i * OPTIONS.angleStep}deg)` }}
                />
              </React.Fragment>
            )
          }
        </div>
      </div>
      <div className={style.spin}>
        SPIN
      </div>
    </div>
  )
}

export default Wheel
