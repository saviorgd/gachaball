# GachaBall
## Product Requirements Document
**Version 1.2 · June 2026**

> **Changelog**
> - v1.1 — อัปเดต Custom tab: Max default, Number of Draws field, Duplicates radio
> - v1.2 — ย้าย Phase 2 Bar ไปใต้ Draw Card, เพิ่ม "Coming soon" overlay

---

## Segment 1 — Functional / Feature Requirements

### 1.1 Draw Modes
แอปมี 3 mode แยกอิสระ เลือกผ่าน segmented control ด้านบน:

**Mega Millions**
- White balls: 5 ลูก จากช่วง 1–70 (ไม่ซ้ำ, ไม่เรียง sort)
- Mega Ball: 1 ลูก จากช่วง 1–25
- White balls และ Mega Ball มาจาก pool แยกกัน

**Powerball**
- White balls: 5 ลูก จากช่วง 1–69 (ไม่ซ้ำ, ไม่เรียง sort)
- Power Ball: 1 ลูก จากช่วง 1–26
- White balls และ Power Ball มาจาก pool แยกกัน

**Custom Ball**
- ผู้ใช้กำหนด Min / Max / จำนวนลูกเอง
- มีเฉพาะ white balls — ไม่มี special ball
- Default values: Min = 0, Max = 9
- Input field มี max 28 ตัวอักษร (Min และ Max)

### 1.2 Draw Mechanic
- ปุ่ม "Draw Next Ball" — กด 1 ครั้ง สุ่ม white balls 1 ลูก
- ปุ่ม "Draw Remaining Ball" — กด 1 ครั้ง สุ่ม white balls ที่เหลือต่อไป ครบในครั้งเดียว ทยอยแสดงทีละลูก เว้น 1 วินาทีต่อลูก
- ปุ่ม "Draw Mega Ball" / "Draw Power Ball" — enabled เฉพาะหลัง white balls ครบแล้ว, สุ่ม 1 ลูก
- ปุ่มแต่ละปุ่ม disabled อัตโนมัติเมื่อ pool ของตัวเองครบแล้ว
- ปุ่ม Reset — ล้างผลทั้งหมด balls fade out แล้วเริ่มต้นใหม่
- ปุ่ม Share — ปรากฏเมื่อสุ่มครบทุก ball (แทนที่ draw buttons)

### 1.3 Validation & Error States
**Custom Ball — inline validation (เกิดทันที ไม่รอ submit)**
- Min > Max → error pop-up เมื่อกดปุ่ม Draw แจ้งให้ผู้ใช้แก้ไข
- Number of Draws น้อยกว่า 1 → error "อย่างน้อย 1"
- Number of Draws มากกว่า 30 → error "ไม่เกิน 30"
- Count > Range ใน No Duplicates mode → draw จนหมด pool แล้วหยุด (silent, ไม่มี error)
- Input field รับได้สูงสุด 28 ตัวอักษร (Min, Max) / 2 ตัวอักษร (Number of Draws)

### 1.4 Session State
- Default tab เมื่อเปิดแอปครั้งแรก: Mega Millions
- จำ tab ที่เลือกไว้ใน session — ครั้งถัดไปเริ่มที่ tab สุดท้ายที่ใช้

### 1.5 Share & Export
- Export เป็น image ประกอบด้วย: ball row + label mode + date/time (local time ของ user)
- Format วันที่: Jun 14, 2026 · 14:30
- Custom Ball label แสดง config ด้วย เช่น "Custom Ball · 1–50, 6 balls"
- Mobile: trigger native share sheet (navigator.share)
- Desktop: fallback download image

### 1.6 Randomization Algorithm
- ใช้ Fisher-Yates Shuffle สำหรับการสุ่มลำดับ
- ใช้ crypto.getRandomValues() เป็น entropy source แทน Math.random()
- ใช้กับทุก mode ทั้ง Mega Millions, Powerball และ Custom Ball

### 1.7 Phase 2 (ยังไม่ implement)
- แสดง estimated jackpot ของงวดถัดไป
- แสดง countdown timer ถึง next draw date (วัน : ชั่วโมง : นาที : วินาที)
- Phase 2 Bar แสดงอยู่ **ใต้** Draw Area Card (Mega Millions และ Powerball เท่านั้น)
- ปัจจุบัน: แสดง shimmer skeleton พร้อม text "Coming soon" overlay ทั้งสองช่อง

---

## Segment 2 — UI / Layout Spec

### 2.1 Global Layout
- Mobile-first, full-width, single column
- Max-width 480px, centered บน desktop
- Background: #FAFAFA (off-white)
- Padding horizontal: 16px
- Font: Inter หรือ DM Sans

### 2.2 Section 1 — Header
- App name typography-only ไม่มี logo image
- h1 font-size ไม่เกิน 20px

### 2.3 Section 2 — Mode Selector
- Pill-style segmented control, full-width, 3 segments
- Active state: filled neutral dark (#1A1A1A), text white
- Inactive state: transparent, text muted gray

### 2.4 Section 3 — Phase 2 Bar (Mega / Powerball only)
- **ตำแหน่ง: ใต้ Draw Area Card** (เปลี่ยนจาก v1.0 ที่อยู่เหนือ)
- Background: #F0F0F0, border-radius 12px
- Jackpot amount: shimmer skeleton + text "Coming soon" overlay (center-aligned)
- Next draw: shimmer skeleton + text "Coming soon" overlay (center-aligned)
- Text overlay: สี #9A9A9A, font-size xs, font-weight medium

### 2.5 Section 4 — Draw Area Card
- Border-radius 20px, padding 24px
- Color scheme เปลี่ยนตาม tab พร้อม transition 200ms ease

| Tab | Card BG | Draw Button | Special Ball | Text |
|---|---|---|---|---|
| Mega Millions | #1a3a6b (deep blue) | #f5c518 (yellow), text dark | #f5c518 | White |
| Powerball | #7b1a1a (crimson) | #c0392b (red), text white | #e74c3c | White |
| Custom | #1A1A1A (neutral dark) | #444, text white | #888 | White |

**Ball row:**
- White balls: 52px diameter, gap 8px
- Gap ก่อน special ball: 22px
- Placeholder: border-only circle, "?" จาง opacity 30%
- Drawn ball: scale-in (0.5→1.0) + fade-in, duration 300ms ease-out, stagger 1000ms ต่อลูก

**Buttons (inside card):**
- "Draw White Ball": full-width, height 50px, border-radius 12px
- "Draw Special Ball": full-width, height 50px — disabled จนกว่า white balls ครบ
- Disabled state: opacity 35%, cursor not-allowed
- "Reset": text button, muted color, align center, ขนาดเล็ก — อยู่ใต้ draw buttons
- "Share": โผล่แทน draw buttons เมื่อครบ, icon share + label, outlined style

### 2.6 Section 5 — Custom Config (Custom tab only)
- อยู่เหนือ Draw Area Card

**Min / Max fields**
- Stack vertical, input type text (numeric), max 28 ตัวอักษร
- Inline validation: error text สีแดงใต้ field ทันที

**Number of Draws field** *(เปลี่ยนชื่อจาก "จำนวนลูก")*
- Input + ปุ่ม − และ + ทางขวาของ input (height 42px, width 42px)
- ปุ่ม − disabled เมื่อค่า = 1 / ปุ่ม + disabled เมื่อค่า = 30
- Quick-select buttons ใต้ input เรียงแนวนอน: `1` `2` `3` `6`
- ค่าสูงสุด: 30 / ค่าเริ่มต้น: 6 / input max 2 ตัวอักษร

**Duplicates** *(เปลี่ยนจาก "Repeat mode" pill toggle)*
- แสดงเป็น radio buttons 2 ตัวเลือก:
  - ○ No Duplicates (internal: `no-repeat`)
  - ○ Allow Duplicates (internal: `allow-repeat`)
- ค่าเริ่มต้น: **Allow Duplicates**

### 2.7 Share Export Image
- Capture เฉพาะ ball row + label mode + date/time local
- Custom Ball label: "Custom Ball · {min}–{max}, {n} balls"
- Background ตาม theme ของ tab นั้น
- ไม่มี UI chrome อื่น (ไม่มี button, ไม่มี app name)
- Library: dom-to-image-more
- Mobile: navigator.share → Desktop: download image

---

## Segment 3 — Tech Stack

### 3.1 Dependencies

| Package | Version | เหตุผล |
|---|---|---|
| react, react-dom | 18.x | Component model รองรับ state ซับซ้อน |
| vite | latest stable | Build tool + dev server เร็ว, output static files |
| tailwindcss | v3.x | Utility-first, mobile-first, stable ecosystem |
| framer-motion | latest | Handle ball scale-in + fade-in + stagger |
| dom-to-image-more | latest | Handle border-radius + custom font |

### 3.2 Deployment
- Target: GitHub Pages
- Vite config: `base: '/gachaball/'`
- Build output: static files — ไม่มี server-side rendering

### 3.3 Phase 2 Consideration
เมื่อถึง Phase 2 (jackpot + countdown) ถ้า data มาจาก third-party API ที่ต้องการ CORS proxy หรือ API key สามารถเพิ่ม Vercel Edge Function หรือ Netlify Function ได้โดยไม่ต้อง migrate stack
