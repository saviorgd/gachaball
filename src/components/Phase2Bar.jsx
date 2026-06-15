function Shimmer({ width, height, radius = 6 }) {
  return (
    <div
      style={{ width, height, borderRadius: radius }}
      className="animate-pulse bg-[#DCDCDC]"
    />
  )
}

function ComingSoonBlock({ shimmerWidth, shimmerHeight }) {
  return (
    <div className="relative">
      <Shimmer width={shimmerWidth} height={shimmerHeight} />
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-medium"
        style={{ color: '#9A9A9A' }}
      >
        Coming soon
      </span>
    </div>
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
        <ComingSoonBlock shimmerWidth={120} shimmerHeight={22} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[#9A9A9A]">
          Next draw
        </span>
        <ComingSoonBlock shimmerWidth={104} shimmerHeight={16} />
      </div>
    </div>
  )
}
