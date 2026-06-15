import { useState, useRef, useEffect, useMemo } from 'react'
import { MODES, CUSTOM_DEFAULTS, SESSION_TAB_KEY, MODE_ORDER, CUSTOM_MAX_DRAWS } from './config/modes'
import { useDraw } from './hooks/useDraw'
import { drawUnique, drawWithRepeat, drawSpecial } from './lib/random'
import { shareOrDownload, formatDateTime } from './lib/share'

import Header from './components/Header'
import ModeSelector from './components/ModeSelector'
import Phase2Bar from './components/Phase2Bar'
import CustomConfig from './components/CustomConfig'
import DrawCard from './components/DrawCard'
import ExportCard from './components/ExportCard'
import ErrorPopup from './components/ErrorPopup'

// อ่าน tab สุดท้ายจาก session (PRD §1.4) — ครั้งแรกสุด default = Mega Millions
function readInitialTab() {
  try {
    const saved = sessionStorage.getItem(SESSION_TAB_KEY)
    if (saved && MODE_ORDER.includes(saved)) return saved
  } catch (_) {
    /* sessionStorage อาจถูกปิด (private mode บางเบราว์เซอร์) */
  }
  return 'megamillions'
}

// แปลง custom config (string จาก input) → ตัวเลข + ตรวจ validation
function parseCustom(config) {
  const toNum = (s) => (s === '' || s == null ? NaN : Number(s))
  const min = toNum(config.min)
  const max = toNum(config.max)
  const count = toNum(config.count)

  const errors = {}
  const allFilled = Number.isFinite(min) && Number.isFinite(max) && Number.isFinite(count)

  // inline validation แบบ real-time (PRD §2.6) — แสดงทันทีที่กรอกครบ
  if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
    errors.min = 'Min ต้องไม่มากกว่า Max'
  }
  if (Number.isFinite(count) && count < 1) {
    errors.count = 'อย่างน้อย 1'
  } else if (Number.isFinite(count) && count > CUSTOM_MAX_DRAWS) {
    errors.count = `ไม่เกิน ${CUSTOM_MAX_DRAWS}`
  }

  const rangeSize = Number.isFinite(min) && Number.isFinite(max) ? max - min + 1 : 0
  // จำนวนลูกที่จะแสดง/จับได้จริง
  let plannedCount = 0
  if (allFilled && count >= 1 && rangeSize > 0 && min <= max) {
    plannedCount =
      config.repeatMode === 'allow-repeat' ? count : Math.min(count, rangeSize)
  }

  const valid = allFilled && min <= max && count >= 1 && count <= CUSTOM_MAX_DRAWS && rangeSize > 0
  return { min, max, count, rangeSize, errors, valid, plannedCount }
}

export default function App() {
  const [activeMode, setActiveMode] = useState(readInitialTab)
  const [customConfig, setCustomConfig] = useState({
    min: String(CUSTOM_DEFAULTS.min),
    max: String(CUSTOM_DEFAULTS.max),
    count: String(CUSTOM_DEFAULTS.count),
    repeatMode: CUSTOM_DEFAULTS.repeatMode,
  })
  const [sharing, setSharing] = useState(false)
  const [popup, setPopup] = useState({ open: false, message: '' })

  const exportRef = useRef(null)
  const { state, drawNextOne, startRemaining, drawSpecialBall, reset } = useDraw(activeMode)

  const mode = MODES[activeMode]
  const theme = mode.theme
  const cur = state[activeMode]
  const isCustom = activeMode === 'custom'
  const hasSpecial = !!mode.special

  const custom = useMemo(() => parseCustom(customConfig), [customConfig])

  // จำ tab ที่เลือกไว้ใน session (PRD §1.4)
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_TAB_KEY, activeMode)
    } catch (_) {
      /* เงียบไว้ถ้า session ใช้ไม่ได้ */
    }
  }, [activeMode])

  // ---- derived state ของปุ่ม/ball ----
  const whiteComplete =
    cur.whiteBalls.length > 0 && cur.revealedCount >= cur.whiteBalls.length && !cur.drawingWhite

  // จำนวน slot placeholder ก่อนจับ
  const plannedWhiteCount = isCustom
    ? custom.plannedCount
    : mode.white.count

  const displayWhiteCount =
    cur.whiteBalls.length > 0 ? cur.whiteBalls.length : plannedWhiteCount

  const allRevealed = cur.whiteBalls.length > 0 && cur.revealedCount >= cur.whiteBalls.length
  const nextDisabled = cur.drawingWhite || allRevealed
  const remainingDisabled = cur.drawingWhite || allRevealed
  const specialDisabled = !whiteComplete || cur.special != null

  const allDrawn = hasSpecial ? whiteComplete && cur.special != null : whiteComplete
  const showShare = allDrawn
  const showReset = cur.whiteBalls.length > 0 || cur.special != null

  // ---- handlers ----
  // คืน balls array (สร้างใหม่ถ้ายังไม่มี) หรือ null ถ้า custom validation ไม่ผ่าน
  function resolveWhiteBalls() {
    if (cur.whiteBalls.length > 0) return cur.whiteBalls
    if (isCustom) {
      if (!Number.isFinite(custom.min) || !Number.isFinite(custom.max) || !Number.isFinite(custom.count)) {
        setPopup({ open: true, message: 'กรุณากรอก Min, Max และจำนวนลูกให้ครบ' })
        return null
      }
      if (custom.min > custom.max) {
        setPopup({ open: true, message: 'Min มากกว่า Max — กรุณาแก้ไขช่วงตัวเลขก่อนจับ' })
        return null
      }
      if (custom.count < 1) {
        setPopup({ open: true, message: 'จำนวนลูกต้องอย่างน้อย 1' })
        return null
      }
      return customConfig.repeatMode === 'allow-repeat'
        ? drawWithRepeat(custom.min, custom.max, custom.count)
        : drawUnique(custom.min, custom.max, custom.count)
    }
    const { min, max, count } = mode.white
    return drawUnique(min, max, count)
  }

  function handleDrawNext() {
    if (nextDisabled) return
    const balls = resolveWhiteBalls()
    if (balls === null) return
    drawNextOne(activeMode, balls)
  }

  function handleDrawRemaining() {
    if (remainingDisabled) return
    const balls = resolveWhiteBalls()
    if (balls === null) return
    startRemaining(activeMode, balls)
  }

  function handleDrawSpecial() {
    if (specialDisabled || !hasSpecial) return
    const ball = drawSpecial(mode.special.min, mode.special.max)
    drawSpecialBall(activeMode, ball)
  }

  function handleReset() {
    reset(activeMode)
  }

  async function handleShare() {
    if (sharing) return
    setSharing(true)
    try {
      await shareOrDownload(exportRef.current, {
        backgroundColor: theme.cardBg,
        fileName: `gachaball-${activeMode}.png`,
      })
    } catch (err) {
      setPopup({ open: true, message: 'แชร์ไม่สำเร็จ ลองอีกครั้ง' })
    } finally {
      setSharing(false)
    }
  }

  // label สำหรับ export image
  const exportLabel = isCustom
    ? `Custom Ball · ${custom.min}–${custom.max}, ${cur.whiteBalls.length} balls`
    : mode.label

  return (
    <div className="mx-auto min-h-screen max-w-app px-4 pb-12">
      <Header />

      <ModeSelector active={activeMode} onChange={setActiveMode} />

      {/* Custom Config — เหนือ Draw Area Card (PRD §2.6) */}
      {isCustom && (
        <div className="mt-4">
          <CustomConfig config={customConfig} onChange={setCustomConfig} errors={custom.errors} />
        </div>
      )}

      <div className="mt-4">
        <DrawCard
          theme={theme}
          whiteCount={displayWhiteCount}
          whiteBalls={cur.whiteBalls}
          revealedCount={cur.revealedCount}
          hasSpecial={hasSpecial}
          specialValue={cur.special}
          specialButtonLabel={hasSpecial ? mode.special.buttonLabel : undefined}
          nextDisabled={nextDisabled}
          remainingDisabled={remainingDisabled}
          specialDisabled={specialDisabled}
          showShare={showShare}
          showReset={showReset}
          sharing={sharing}
          onDrawNext={handleDrawNext}
          onDrawRemaining={handleDrawRemaining}
          onDrawSpecial={handleDrawSpecial}
          onReset={handleReset}
          onShare={handleShare}
        />
      </div>

      {/* Phase 2 Bar — ใต้ Draw Card, เฉพาะ Mega / Powerball */}
      {!isCustom && (
        <div className="mt-4">
          <Phase2Bar />
        </div>
      )}

      {/* node สำหรับ capture เป็นรูป (อยู่นอกจอ) */}
      <ExportCard
        ref={exportRef}
        theme={theme}
        whiteBalls={cur.whiteBalls}
        hasSpecial={hasSpecial}
        specialValue={cur.special}
        modeLabel={exportLabel}
        dateTime={formatDateTime(new Date())}
      />

      <ErrorPopup
        open={popup.open}
        message={popup.message}
        onClose={() => setPopup({ open: false, message: '' })}
      />
    </div>
  )
}
