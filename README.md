# GachaBall

แอปสุ่มลูกบอลล็อตเตอรี่ (Mega Millions / Powerball / Custom) — React + Vite + Tailwind v3 + Framer Motion
สร้างตาม Product Requirements Document v1.0

## Stack

| Package | เหตุผล |
| --- | --- |
| React 18 | Component model รองรับ state ซับซ้อน (animation stagger, disabled state, tab switching) |
| Vite | Build เร็ว, output static files พร้อม deploy บน GitHub Pages |
| Tailwind CSS v3 | Utility-first, mobile-first, stable กับ Vite |
| Framer Motion | ball scale-in + fade-in + stagger |
| dom-to-image-more | export ball row เป็นรูปสำหรับแชร์ |

## รันในเครื่อง (local)

ต้องมี Node.js 18+ (แนะนำ 20)

```bash
npm install      # ติดตั้ง dependencies
npm run dev      # เปิด dev server ที่ http://localhost:5173/gachaball/
```

## Build

```bash
npm run build    # output ไปที่ ./dist
npm run preview  # ดูตัว build ที่ build แล้วก่อน deploy
```

## Deploy ขึ้น GitHub Pages

มี GitHub Actions workflow ให้แล้วที่ `.github/workflows/deploy.yml`
ทุกครั้งที่ push ขึ้น branch `main` มันจะ build + deploy ให้อัตโนมัติ

ขั้นตอนครั้งแรก:

1. สร้าง repo ชื่อ `gachaball` บน GitHub แล้ว push โค้ดขึ้นไป
2. ไปที่ repo → **Settings → Pages**
3. ที่ **Build and deployment → Source** เลือก **GitHub Actions**
4. รอ workflow รันเสร็จ (แท็บ **Actions**)
5. เปิด `https://<username>.github.io/gachaball/`

> ⚠️ ถ้าตั้งชื่อ repo ไม่ใช่ `gachaball` ต้องแก้ `base` ใน `vite.config.js`
> ให้ตรงกับชื่อ repo (เช่น repo ชื่อ `lotto` → `base: '/lotto/'`)

## โครงสร้างไฟล์

```
src/
├── config/modes.js      ช่วงเลข + สี + label ของแต่ละโหมด (แก้ที่จุดเดียว)
├── lib/random.js        crypto-backed Fisher-Yates (PRD §1.6)
├── lib/share.js         export image + navigator.share / download
├── hooks/useDraw.js     reducer + timer reveal ball ทีละลูก
├── components/          UI ทั้งหมด
└── App.jsx              ประกอบทุกอย่าง + business logic
```
