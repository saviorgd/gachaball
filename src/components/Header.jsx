// Header (PRD §2.2) — typography-only, ไม่มี logo image, h1 ไม่เกิน 20px
export default function Header() {
  return (
    <header className="pt-6 pb-3">
      <h1 style={{ fontSize: 20, letterSpacing: '-0.02em' }} className="font-bold text-[#1A1A1A]">
        GachaBall
      </h1>
    </header>
  )
}
