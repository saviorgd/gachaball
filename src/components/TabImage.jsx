import { useState } from 'react'

const FORMATS = ['webp', 'png', 'jpg']

export default function TabImage({ modeId }) {
  const base = import.meta.env.BASE_URL
  const [formatIdx, setFormatIdx] = useState(0)
  const [failed, setFailed] = useState(false)

  function handleError() {
    const next = formatIdx + 1
    if (next < FORMATS.length) {
      setFormatIdx(next)
    } else {
      setFailed(true)
    }
  }

  if (failed) return null

  return (
    <img
      key={`${modeId}-${formatIdx}`}
      src={`${base}images/${modeId}.${FORMATS[formatIdx]}`}
      onError={handleError}
      alt=""
      className="w-full rounded-2xl object-cover"
    />
  )
}
