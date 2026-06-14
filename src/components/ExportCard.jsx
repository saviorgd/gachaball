import { forwardRef } from 'react'
import Ball from './Ball'

// ---------------------------------------------------------------------------
// ExportCard (PRD §2.7)
//   - node ที่ถูก capture เป็นรูปตอนกด Share
//   - มีเฉพาะ: ball row + label mode + date/time (local) — ไม่มี UI chrome อื่น
//   - background ตาม theme ของ tab
//   - วางไว้นอกจอ (offscreen) เพื่อให้มีอยู่ใน DOM แต่ผู้ใช้ไม่เห็น
//   - balls render แบบ static (ไม่มี animation) เพื่อ capture ได้นิ่ง
// ---------------------------------------------------------------------------

const ExportCard = forwardRef(function ExportCard(
  { theme, whiteBalls, hasSpecial, specialValue, modeLabel, dateTime },
  ref,
) {
  return (
    <div
      // วางนอกจอ: ผู้ใช้มองไม่เห็นแต่ dom-to-image จับภาพได้
      style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}
      aria-hidden
    >
      <div
        ref={ref}
        style={{ backgroundColor: theme.cardBg, color: theme.text, width: 420, padding: 32 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="flex flex-wrap items-center justify-center" style={{ gap: 8, rowGap: 12 }}>
          {whiteBalls.map((v, i) => (
            <Ball key={`ex-w-${i}`} value={v} drawn special={false} theme={theme} staticRender />
          ))}
          {hasSpecial && specialValue != null && (
            <>
              <div style={{ width: 14 }} />
              <Ball value={specialValue} drawn special theme={theme} staticRender />
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-base font-bold">{modeLabel}</span>
          <span style={{ opacity: 0.75 }} className="text-xs">
            {dateTime}
          </span>
        </div>
      </div>
    </div>
  )
})

export default ExportCard
