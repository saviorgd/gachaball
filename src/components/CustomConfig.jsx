import { INPUT_MAX_LENGTH } from '../config/modes'

// ---------------------------------------------------------------------------
// CustomConfig (PRD §2.6)
//   - อยู่เหนือ Draw Area Card (จัดวางใน App)
//   - Fields: Min / Max / จำนวนลูก — stack vertical
//   - Repeat mode: pill toggle (No Repeat / Allow Repeat)
//   - Inline validation: error text สีแดงใต้ field ทันที (real-time, ไม่รอ submit)
//   - Input รับได้สูงสุด 28 ตัวอักษร (PRD §1.1, §1.3)
// ---------------------------------------------------------------------------

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

export default function CustomConfig({ config, onChange, errors }) {
  // อนุญาตเฉพาะตัวเลข (และว่าง) — ตัดอักขระอื่นออก
  const sanitize = (raw) => raw.replace(/[^0-9]/g, '').slice(0, INPUT_MAX_LENGTH)

  const set = (key) => (raw) => onChange({ ...config, [key]: sanitize(raw) })

  const repeatPill = (mode, text) => {
    const isActive = config.repeatMode === mode
    return (
      <button
        onClick={() => onChange({ ...config, repeatMode: mode })}
        className="flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors"
        style={
          isActive
            ? { backgroundColor: '#1A1A1A', color: '#fff' }
            : { backgroundColor: 'transparent', color: '#8A8A8A' }
        }
        aria-pressed={isActive}
      >
        {text}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#EAEAEA] bg-white p-4">
      <Field label="Min number" value={config.min} onChange={set('min')} error={errors.min} placeholder="0" />
      <Field label="Max number" value={config.max} onChange={set('max')} error={errors.max} placeholder="999999" />
      <Field label="จำนวนลูก" value={config.count} onChange={set('count')} error={errors.count} placeholder="6" />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-[#6A6A6A]">Repeat mode</span>
        <div className="flex w-full gap-1 rounded-full bg-[#EFEFEF] p-1">
          {repeatPill('no-repeat', 'No Repeat')}
          {repeatPill('allow-repeat', 'Allow Repeat')}
        </div>
      </div>
    </div>
  )
}
