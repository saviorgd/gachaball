import { motion, AnimatePresence } from 'framer-motion'

// ---------------------------------------------------------------------------
// Ball (PRD §2.5)
//   - placeholder: วงกลม border-only, "?" opacity 30%
//   - drawn: scale-in (0.5 → 1.0) + fade-in, 300ms ease-out
//   - reset: drawn ball fade out (AnimatePresence exit) → กลับเป็น placeholder
//   - staticRender=true: ปิด animation (ใช้ใน export image ที่ต้อง capture นิ่ง ๆ)
// ---------------------------------------------------------------------------

const SIZE = 52 // px diameter

function Placeholder({ isLightText }) {
  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        borderColor: isLightText ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
      }}
      className="flex items-center justify-center rounded-full border-2"
    >
      <span
        style={{ opacity: 0.3, color: isLightText ? '#fff' : '#1A1A1A' }}
        className="text-xl font-semibold"
      >
        ?
      </span>
    </div>
  )
}

export default function Ball({ value, drawn, special, theme, staticRender = false }) {
  const isLightText = theme.placeholderText === 'light'
  const bg = special ? theme.specialBall : '#FFFFFF'
  const fg = special ? theme.specialBallText : theme.whiteBallText

  const drawnBall = (
    <motion.div
      key="drawn"
      initial={staticRender ? false : { scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        width: SIZE,
        height: SIZE,
        backgroundColor: bg,
        color: fg,
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
      }}
      className="flex items-center justify-center rounded-full text-base font-bold tabular-nums"
    >
      {value}
    </motion.div>
  )

  return (
    <div style={{ width: SIZE, height: SIZE }} className="relative shrink-0">
      <div className="absolute inset-0">
        <Placeholder isLightText={isLightText} />
      </div>
      <div className="absolute inset-0">
        <AnimatePresence>{drawn && drawnBall}</AnimatePresence>
      </div>
    </div>
  )
}
