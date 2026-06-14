// ---------------------------------------------------------------------------
// Phase2Bar (PRD §1.7 + §2.4)
//   - แสดงเฉพาะ Mega Millions / Powerball
//   - placeholder skeleton เท่านั้น — ยังไม่ wire data จริง (Phase 2)
//   - bg #F0F0F0, radius 12px
//   - jackpot: bold large (skeleton)  |  countdown: monospace DD:HH:MM:SS (skeleton)
// ---------------------------------------------------------------------------

function Shimmer({ width, height, radius = 6 }) {
  return (
    <div
      style={{ width, height, borderRadius: radius }}
      className="animate-pulse bg-[#DCDCDC]"
    />
  )
}

export default function Phase2Bar() {
  return (
    <div
      style={{ backgroundColor: '#F0F0F0', borderRadius: 12 }}
      className="flex items-center justify-between px-4 py-3"
      aria-label="Jackpot & next draw (coming soon)"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[#9A9A9A]">
          Estimated jackpot
        </span>
        {/* jackpot amount: bold, large (skeleton) */}
        <Shimmer width={120} height={22} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[#9A9A9A]">
          Next draw
        </span>
        {/* countdown: monospace DD:HH:MM:SS (skeleton) */}
        <Shimmer width={104} height={16} />
      </div>
    </div>
  )
}
