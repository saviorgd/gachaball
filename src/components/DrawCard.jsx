import BallRow from './BallRow'

// ---------------------------------------------------------------------------
// DrawCard (PRD §2.5)
//   - border-radius 20px, padding 24px, สีเปลี่ยนตาม tab (transition 200ms)
//   - ปุ่ม Draw White / Draw Special / Reset / Share
//   - Share โผล่ "แทน" draw buttons เมื่อสุ่มครบ
// ---------------------------------------------------------------------------

const baseBtn =
  'w-full rounded-xl font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

function ActionButton({ label, onClick, disabled, bg, color }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseBtn}
      style={{
        height: 50,
        backgroundColor: bg,
        color,
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v12M12 3l-4 4M12 3l4 4M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DrawCard({
  theme,
  whiteCount,
  whiteBalls,
  revealedCount,
  hasSpecial,
  specialValue,
  specialButtonLabel,
  nextDisabled,
  remainingDisabled,
  specialDisabled,
  showShare,
  showReset,
  sharing,
  onDrawNext,
  onDrawRemaining,
  onDrawSpecial,
  onReset,
  onShare,
}) {
  return (
    <div
      style={{
        backgroundColor: theme.cardBg,
        color: theme.text,
        borderRadius: 20,
        padding: 24,
        transition: 'background-color 200ms ease, color 200ms ease',
      }}
      className="flex flex-col gap-6"
    >
      <div className="min-h-[64px] py-2">
        <BallRow
          whiteCount={whiteCount}
          whiteBalls={whiteBalls}
          revealedCount={revealedCount}
          hasSpecial={hasSpecial}
          specialValue={specialValue}
          theme={theme}
        />
      </div>

      <div className="flex flex-col gap-3">
        {showShare ? (
          // Share state — outlined style, แทนที่ draw buttons
          <button
            onClick={onShare}
            disabled={sharing}
            className={`${baseBtn} flex items-center justify-center gap-2 border-2`}
            style={{
              height: 50,
              backgroundColor: 'transparent',
              borderColor: theme.text,
              color: theme.text,
              opacity: sharing ? 0.6 : 1,
              cursor: sharing ? 'wait' : 'pointer',
            }}
          >
            <ShareIcon />
            {sharing ? 'Preparing…' : 'Share'}
          </button>
        ) : (
          <>
            <ActionButton
              label="Manual Blessing"
              onClick={onDrawNext}
              disabled={nextDisabled}
              bg={theme.drawButton}
              color={theme.drawButtonText}
            />
            <ActionButton
              label="Quick Rich"
              onClick={onDrawRemaining}
              disabled={remainingDisabled}
              bg={theme.drawButton}
              color={theme.drawButtonText}
            />
            {hasSpecial && (
              <ActionButton
                label={specialButtonLabel}
                onClick={onDrawSpecial}
                disabled={specialDisabled}
                bg={theme.drawButton}
                color={theme.drawButtonText}
              />
            )}
          </>
        )}

        {showReset && (
          <button
            onClick={onReset}
            className="mx-auto py-1 text-sm font-medium underline-offset-2 hover:underline"
            style={{ color: theme.text, opacity: 0.7 }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
