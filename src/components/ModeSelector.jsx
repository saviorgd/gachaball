import { MODE_ORDER, MODES } from '../config/modes'

// ---------------------------------------------------------------------------
// ModeSelector (PRD §2.3)
//   - pill-style segmented control, full-width, 3 segments
//   - active: filled #1A1A1A, text white
//   - inactive: transparent, text muted gray
// ---------------------------------------------------------------------------

export default function ModeSelector({ active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Draw mode"
      className="flex w-full gap-1 rounded-full bg-[#EFEFEF] p-1"
    >
      {MODE_ORDER.map((id) => {
        const isActive = id === active
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className="flex-1 rounded-full px-2 py-2.5 text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#1A1A1A]"
            style={
              isActive
                ? { backgroundColor: '#1A1A1A', color: '#FFFFFF' }
                : { backgroundColor: 'transparent', color: '#8A8A8A' }
            }
          >
            {MODES[id].label}
          </button>
        )
      })}
    </div>
  )
}
