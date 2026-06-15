import { INPUT_MAX_LENGTH, CUSTOM_MAX_DRAWS } from '../config/modes'

function Field({ label, value, onChange, error, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[#6A6A6A]">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        maxLength={INPUT_MAX_LENGTH}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A]"
        style={{ borderColor: error ? '#e74c3c' : '#E2E2E2' }}
        aria-invalid={!!error}
      />
      {error && <span className="text-xs text-[#e74c3c]">{error}</span>}
    </div>
  )
}

const DRAW_PRESETS = [1, 2, 3, 6]

function DrawsField({ value, onChange, error }) {
  const num = parseInt(value, 10)
  const canDecrease = Number.isFinite(num) && num > 1
  const canIncrease = !Number.isFinite(num) || num < CUSTOM_MAX_DRAWS

  function step(delta) {
    const current = Number.isFinite(num) ? num : 0
    const next = Math.max(1, Math.min(CUSTOM_MAX_DRAWS, current + delta))
    onChange(String(next))
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-[#6A6A6A]">Number of Draws</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={value}
          placeholder="6"
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
          className="flex-1 rounded-xl border bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A]"
          style={{ borderColor: error ? '#e74c3c' : '#E2E2E2' }}
          aria-invalid={!!error}
        />
        <button
          onClick={() => step(-1)}
          disabled={!canDecrease}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-[#E2E2E2] bg-white text-lg font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5]"
          style={{ opacity: canDecrease ? 1 : 0.35, cursor: canDecrease ? 'pointer' : 'not-allowed' }}
          aria-label="Decrease"
        >
          −
        </button>
        <button
          onClick={() => step(1)}
          disabled={!canIncrease}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-[#E2E2E2] bg-white text-lg font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5]"
          style={{ opacity: canIncrease ? 1 : 0.35, cursor: canIncrease ? 'pointer' : 'not-allowed' }}
          aria-label="Increase"
        >
          +
        </button>
      </div>
      <div className="flex gap-1.5">
        {DRAW_PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => onChange(String(p))}
            className="rounded-lg border border-[#E2E2E2] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5]"
            aria-label={`Set ${p} draws`}
          >
            {p}
          </button>
        ))}
      </div>
      {error && <span className="text-xs text-[#e74c3c]">{error}</span>}
    </div>
  )
}

export default function CustomConfig({ config, onChange, errors }) {
  const sanitize = (raw) => raw.replace(/[^0-9]/g, '').slice(0, INPUT_MAX_LENGTH)
  const set = (key) => (raw) => onChange({ ...config, [key]: sanitize(raw) })

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#EAEAEA] bg-white p-4">
      <Field label="Min number" value={config.min} onChange={set('min')} error={errors.min} placeholder="0" />
      <Field label="Max number" value={config.max} onChange={set('max')} error={errors.max} placeholder="9" />
      <DrawsField
        value={config.count}
        onChange={(raw) => onChange({ ...config, count: raw })}
        error={errors.count}
      />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-[#6A6A6A]">Duplicates</span>
        <div className="flex flex-col gap-2">
          {[
            { value: 'no-repeat', label: 'No Duplicates' },
            { value: 'allow-repeat', label: 'Allow Duplicates' },
          ].map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="duplicates-mode"
                value={value}
                checked={config.repeatMode === value}
                onChange={() => onChange({ ...config, repeatMode: value })}
                className="h-4 w-4 accent-[#1A1A1A]"
              />
              <span className="text-sm text-[#1A1A1A]">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
