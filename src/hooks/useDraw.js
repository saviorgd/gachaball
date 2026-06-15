import { useReducer, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// useDraw — จัดการ draw state ของทั้ง 3 โหมด
//   - DRAW_NEXT_ONE: reveal 1 ลูกทันที (ไม่มี timer)
//   - START_REMAINING: reveal ลูกที่เหลือทั้งหมด ทยอย 1 วินาทีต่อลูก
//   - special ball กดได้เฉพาะหลัง white reveal ครบ
//   - แยก state per-mode เพื่อให้สลับ tab แล้วผลไม่หาย
// ---------------------------------------------------------------------------

const REVEAL_INTERVAL_MS = 1000
const FIRST_REVEAL_MS = 350

const emptyMode = () => ({
  whiteBalls: [],
  revealedCount: 0,
  special: null,
  drawingWhite: false,
})

const initialState = {
  megamillions: emptyMode(),
  powerball: emptyMode(),
  custom: emptyMode(),
}

function reducer(state, action) {
  const m = state[action.mode]
  switch (action.type) {
    case 'DRAW_NEXT_ONE': {
      if (m.drawingWhite) return state
      const balls = m.whiteBalls.length > 0 ? m.whiteBalls : action.balls
      return {
        ...state,
        [action.mode]: { ...m, whiteBalls: balls, revealedCount: m.revealedCount + 1 },
      }
    }
    case 'START_REMAINING': {
      if (m.drawingWhite) return state
      const balls = m.whiteBalls.length > 0 ? m.whiteBalls : action.balls
      return {
        ...state,
        [action.mode]: {
          ...m,
          whiteBalls: balls,
          drawingWhite: balls.length > m.revealedCount,
        },
      }
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

  // timer reveal ทีละลูกสำหรับ START_REMAINING เท่านั้น
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

  const drawNextOne = useCallback((mode, balls) => {
    dispatch({ type: 'DRAW_NEXT_ONE', mode, balls })
  }, [])

  const startRemaining = useCallback((mode, balls) => {
    dispatch({ type: 'START_REMAINING', mode, balls })
  }, [])

  const drawSpecialBall = useCallback((mode, ball) => {
    dispatch({ type: 'DRAW_SPECIAL', mode, ball })
  }, [])

  const reset = useCallback((mode) => {
    dispatch({ type: 'RESET', mode })
  }, [])

  return { state, drawNextOne, startRemaining, drawSpecialBall, reset }
}
