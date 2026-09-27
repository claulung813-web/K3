import { useState } from 'react'

export function CutePic({
  name,
  emoji,
  label,
  className = '',
}: {
  name: string
  emoji: string
  label: string
  className?: string
}) {
  const [src, setSrc] = useState(`${import.meta.env.BASE_URL}pics/${name}.svg`)

  if (!src) {
    return (
      <span className={`cute-fallback ${className}`} aria-hidden="true">
        {emoji}
      </span>
    )
  }

  return (
    <img
      className={`cute-pic ${className}`}
      src={src}
      alt={label}
      draggable={false}
      onError={() => {
        if (src.startsWith('/pics/')) {
          setSrc(`https://api.iconify.design/fluent-emoji/${name}.svg?height=128`)
          return
        }
        setSrc('')
      }}
    />
  )
}
