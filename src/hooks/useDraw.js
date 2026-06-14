import { useReducer, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// useDraw — จัดการ draw state ของทั้ง 3 โหมด (PRD §1.2)
//   - whiteBalls ถูกสุ่ม "ครบในครั้งเดียว" ตอนกด Draw แต่ค่อย ๆ reveal ทีละลูก
//   - reveal cadence = 1000ms ต่อลูก (timer อยู่ใน hook นี้)
//   - special ball กดได้เฉพาะหลัง white reveal ครบ
//   - แยก state per-mode เพื่อให้สลับ tab แล้วผลของแต่ละโหมดไม่หาย
// ---------------------------------------------------------------------------

const REVEAL_INTERVAL_MS = 1000 // PRD: เว้น 1 วินาทีต่อลูก
const FIRST_REVEAL_MS = 350 // ลูกแรกโผล่ไวขึ้นเล็กน้อยให้รู้สึก responsive

const emptyMode = () => ({
  whiteBalls: [], // เลขที่สุ่มได้ครบแล้ว (full)
  revealedCount: 0, // จำนวนลูกที่ reveal บนจอแล้ว
  special: null, // เลข special ball (null = ยังไม่จับ)
  drawingWhite: false, // กำลังทยอย reveal white อยู่หรือไม่
})

const initialState = {
  megamillions: emptyMode(),
  powerball: emptyMode(),
  custom: emptyMode(),
}

function reducer(state, action) {
  const m = state[action.mode]
  switch (action.type) {
    case 'START_WHITE':
      return {
        ...state,
        [action.mode]: {
          ...emptyMode(),
          whiteBalls: action.balls,
          revealedCount: 0,
          drawingWhite: action.balls.length > 0,
        },
      }
    case 'REVEAL_ONE':
      if (!m.drawingWhite) return state
      return {
        ...state,
        [action.mode]: { ...m, revealedCount: m.revealedCount + 1 },
      }
    case 'WHITE_DONE':
      return { ...state, [action.mode]: { ...m, drawingWhite: false } }
    case 'DRAW_SPECIAL':
      return { ...state, [action.mode]: { ...m, special: action.ball } }
    case 'RESET':
      return { ...state, [action.mode]: emptyMode() }
    default:
      return state
  }
}

export function useDraw(activeMode) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const cur = state[activeMode]

  // timer reveal ทีละลูกสำหรับโหมดที่กำลัง active อยู่
  useEffect(() => {
    if (!cur.drawingWhite) return
    if (cur.revealedCount >= cur.whiteBalls.length) {
      dispatch({ type: 'WHITE_DONE', mode: activeMode })
      return
    }
    const delay = cur.revealedCount === 0 ? FIRST_REVEAL_MS : REVEAL_INTERVAL_MS
    const t = setTimeout(() => dispatch({ type: 'REVEAL_ONE', mode: activeMode }), delay)
    return () => clearTimeout(t)
  }, [activeMode, cur.drawingWhite, cur.revealedCount, cur.whiteBalls.length])

  const startWhiteDraw = useCallback((mode, balls) => {
    dispatch({ type: 'START_WHITE', mode, balls })
  }, [])

  const drawSpecialBall = useCallback((mode, ball) => {
    dispatch({ type: 'DRAW_SPECIAL', mode, ball })
  }, [])

  const reset = useCallback((mode) => {
    dispatch({ type: 'RESET', mode })
  }, [])

  return { state, startWhiteDraw, drawSpecialBall, reset }
}
