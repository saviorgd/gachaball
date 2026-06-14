import Ball from './Ball'

// ---------------------------------------------------------------------------
// BallRow (PRD §2.5)
//   - white balls: gap 8px
//   - gap ก่อน special ball: 22px
//   - reveal ตาม revealedCount (ลูกที่ยังไม่ reveal = placeholder)
//   - รองรับการ wrap เมื่อจำนวนลูกเยอะ (Custom)
// ---------------------------------------------------------------------------

export default function BallRow({
  whiteCount, // จำนวน slot ของ white ball ที่ควรแสดง (placeholder รวม)
  whiteBalls, // เลขที่สุ่มได้ (อาจยังไม่ครบ slot)
  revealedCount, // จำนวนที่ reveal แล้ว
  hasSpecial,
  specialValue,
  theme,
}) {
  const slots = []
  for (let i = 0; i < whiteCount; i++) {
    const drawn = i < revealedCount && i < whiteBalls.length
    slots.push(
      <Ball
        key={`w-${i}`}
        value={drawn ? whiteBalls[i] : null}
        drawn={drawn}
        special={false}
        theme={theme}
      />,
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center" style={{ gap: 8, rowGap: 12 }}>
      {slots}
      {hasSpecial && (
        <>
          {/* gap พิเศษ 22px ก่อน special ball (8px มาจาก flex gap แล้ว → เติมอีก 14px) */}
          <div style={{ width: 14 }} aria-hidden className="shrink-0" />
          <Ball
            value={specialValue}
            drawn={specialValue != null}
            special
            theme={theme}
          />
        </>
      )}
    </div>
  )
}
