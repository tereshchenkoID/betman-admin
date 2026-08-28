import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useOutsideClick } from 'hooks/useOutsideClick'

import Node from './Node'

import style from './index.module.scss'

const Tree = ({ data }) => {
  const [toggle, setToggle] = useState(false)
  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  useOutsideClick(
    blockRef,
    () => setToggle(null),
    {
      ...toggle,
      meta: { buttonRef }
    }
  )

  if (!data) return null

  return (
    <div
      ref={blockRef}
      className={style.block}
    >
      <button
        type={'button'}
        className={style.toggle}
        onClick={() => setToggle(!toggle)}
        aria-label={'Toggle'}
        ref={buttonRef}
      >
        <FontAwesomeIcon icon='fa-solid fa-folder-tree' />
      </button>
      {
        toggle &&
        <div className={style.dropdown}>
          <Node node={data.tree} />
        </div>
      }
    </div>
  )
}

export default Tree
