import {
  createElement, lazy, memo, Suspense
} from 'react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

const loadedIcons = new Map()

const toKebabCase = (str) =>
  str
    ? str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase()
    : ''

const getLucideIcon = (key) => {
  if (!loadedIcons.has(key)) {
    loadedIcons.set(key, lazy(dynamicIconImports[key]))
  }
  return loadedIcons.get(key)
}

const Sprite = memo(({
  name,
  className,
  size = '20',
  color,
  fallback = 'help-circle',
  ...props
}) => {
  const iconName = toKebabCase(name)
  const hasIcon = iconName in dynamicIconImports

  const key = hasIcon ? iconName : fallback
  const LucideIcon = getLucideIcon(key)

  return (
    <Suspense fallback={null}>
      {createElement(LucideIcon, {
        className,
        size,
        color,
        ...props,
      })}
    </Suspense>
  )
})

Sprite.displayName = 'Sprite'

export default Sprite
