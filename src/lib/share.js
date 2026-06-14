// ---------------------------------------------------------------------------
// Share & Export (PRD §1.5, §2.7)
//   - capture เฉพาะ ball row + label + date/time จาก DOM node ที่กำหนด
//   - Mobile: navigator.share (native share sheet)
//   - Desktop / ไม่รองรับ share files: fallback ดาวน์โหลดเป็น image
//   - Library: dom-to-image-more
// ---------------------------------------------------------------------------

import domtoimage from 'dom-to-image-more'

/** format วันเวลาแบบ local: "Jun 14, 2026 · 14:30" (PRD §1.5) */
export function formatDateTime(date = new Date()) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const mon = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${mon} ${day}, ${year} · ${hh}:${mm}`
}

/** ตรวจว่าอุปกรณ์รองรับการแชร์ "ไฟล์" ผ่าน Web Share API หรือไม่ */
function canShareFiles(file) {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    typeof navigator.share === 'function' &&
    navigator.canShare({ files: [file] })
  )
}

/**
 * แปลง DOM node → PNG blob ด้วย dom-to-image-more
 * scale 2x เพื่อความคมบนจอ retina
 */
async function nodeToBlob(node, backgroundColor) {
  const scale = 2
  const { offsetWidth: w, offsetHeight: h } = node
  return domtoimage.toBlob(node, {
    bgcolor: backgroundColor,
    width: w * scale,
    height: h * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${w}px`,
      height: `${h}px`,
    },
  })
}

/**
 * แชร์หรือดาวน์โหลด image ของ node
 * @param {HTMLElement} node       element ที่จะ capture (export card)
 * @param {object}      opts
 * @param {string}      opts.backgroundColor  สีพื้นตาม theme ของ tab
 * @param {string}      opts.fileName          ชื่อไฟล์ png
 */
export async function shareOrDownload(node, { backgroundColor, fileName = 'gachaball.png' }) {
  if (!node) throw new Error('export node not ready')

  const blob = await nodeToBlob(node, backgroundColor)
  const file = new File([blob], fileName, { type: 'image/png' })

  // Mobile / รองรับ share files → เปิด native share sheet
  if (canShareFiles(file)) {
    try {
      await navigator.share({ files: [file], title: 'GachaBall' })
      return { method: 'share' }
    } catch (err) {
      // ผู้ใช้กดยกเลิก share → ไม่ถือเป็น error
      if (err && err.name === 'AbortError') return { method: 'cancelled' }
      // ถ้า share พังด้วยเหตุอื่น ค่อย fallback ไปดาวน์โหลด
    }
  }

  // Desktop fallback → ดาวน์โหลดไฟล์
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return { method: 'download' }
}
