import React from 'react'
import { Link } from 'react-router-dom'

import style from './index.module.scss'

const Node = ({ node }) => {
  if (!node) return null

  return (
    <ul className={style.block}>
      <li>
        <Link
          to={node.id}
          rel="noreferrer"
          className={style.link}
        >
          {node.username}
        </Link>
        {
          node?.child &&
          <div className={style.wrapper}>
            <div className={style.arrow} />
            <Node node={node.child}/>
          </div>
        }
      </li>
    </ul>
  );
};

export default Node
