import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutsideClick } from 'hooks/useOutsideClick'

import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import style from './index.module.scss'

const Option = ({ data, option, active, setActive, onChange, full }) => {
  return (
    <>
      {option.username && (
        <button
          type={'button'}
          className={classNames(
            style.link,
            data.id === option.id && style.active,
          )}
          onClick={() => {
            setActive(!active)
            onChange({
              id: option.id,
              username: option.username,
            })
          }}
        >
          {
            full &&
            <FontAwesomeIcon
              icon={`fa-solid ${option.shops ? 'fa-user' : 'fa-shop'}`}
              className={style.icon}
            />
          }
          {option.username}
        </button>
      )}
      {full && option.shops && (
        <ul className={style.ul}>
          {option.shops.map((childNode, idx) => (
            <li key={idx}>
              <Option
                option={childNode}
                data={data}
                active={active}
                setActive={setActive}
                onChange={onChange}
                full={full}
              />
            </li>
          ))}
        </ul>
      )}
      {option.clients && (
        <ul className={style.ul}>
          {option.clients.map((childNode, idx) => (
            <li key={idx}>
              <Option
                option={childNode}
                data={data}
                active={active}
                setActive={setActive}
                onChange={onChange}
                full={full}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

const Agents = ({
  data,
  options,
  onChange,
  placeholder = false,
  full = false,
}) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(false)
  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useOutsideClick(
    blockRef,
    () => {
      setActive(false)
    },
    {
      ...data,
      meta: {
        buttonRef: buttonRef,
      },
    },
  )

  const searchByUsername = (node, term) => {
    if (node.username && node.username.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
      return [node]
    }

    if (node.clients) {
      let results = []
      for (const client of node.clients) {
        results = results.concat(searchByUsername(client, term))
      }
      return results
    }

    if (full && node.shops) {
      let results = []
      for (const shop of node.shops) {
        results = results.concat(searchByUsername(shop, term))
      }
      return results
    }

    return []
  }

  const handleSearch = () => {
    const results = searchByUsername(options[0], searchTerm)
    setSearchResults(results)
  }

  useEffect(() => {
    handleSearch()
  }, [searchTerm])

  return (
    <div
      ref={blockRef}
      className={classNames(style.block, active && style.active)}
    >
      <button
        ref={buttonRef}
        type={'button'}
        className={classNames(style.selected, active && style.active)}
        onClick={() => setActive(!active)}
      >
        {data.username}
      </button>
      <div className={style.wrapper}>
        <div className={style.search}>
          <input
            type={'text'}
            className={style.field}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className={style.list}>
          {searchResults.map((node, idx) => (
            <li key={idx}>
              <Option
                option={node}
                data={data}
                active={active}
                setActive={setActive}
                onChange={onChange}
                full={full}
              />
            </li>
          ))}
        </ul>
      </div>
      <label className={style.label}>{placeholder || t('agent')}</label>
    </div>
  )
}

export default Agents
