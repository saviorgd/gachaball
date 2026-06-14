// ---------------------------------------------------------------------------
// Randomization (PRD §1.6)
//   - entropy source: crypto.getRandomValues()  (ไม่ใช้ Math.random())
//   - การสุ่มลำดับ/เลือกแบบไม่ซ้ำ: Fisher-Yates shuffle
//   - ใช้กับทุกโหมด (Mega Millions / Powerball / Custom)
// ---------------------------------------------------------------------------

// จำนวนสมาชิก pool สูงสุดที่ยอมสร้างเป็น array จริงเพื่อทำ Fisher-Yates
// ถ้าใหญ่กว่านี้ (เช่น Custom 0–999999 = 1,000,000 ช่อง) จะสลับไปใช้
// crypto + Set rejection เพื่อไม่ต้อง allocate array ขนาดมหาศาลทุกครั้งที่สุ่ม
const FISHER_YATES_POOL_LIMIT = 200000

/**
 * คืนจำนวนเต็มแบบสุ่มในช่วง [0, maxExclusive) โดยไม่มี modulo bias
 * ใช้ rejection sampling บน Uint32 (PRD: crypto.getRandomValues)
 */
export function cryptoRandomInt(maxExclusive) {
  if (maxExclusive <= 0) return 0
  if (maxExclusive === 1) return 0
  // ตัดค่าที่อยู่เหนือ "largest multiple of n" ทิ้ง เพื่อลบ bias
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive
  const buf = new Uint32Array(1)
  let v
  do {
    crypto.getRandomValues(buf)
    v = buf[0]
  } while (v >= limit)
  return v % maxExclusive
}

/**
 * Fisher-Yates (partial) — เลือก k ลูกแบบไม่ซ้ำจาก pool
 * เป็นการ shuffle เฉพาะ k ตำแหน่งแรก จึง O(k) ไม่ต้อง shuffle ทั้ง array
 * ผลลัพธ์ "ไม่เรียง sort" ตาม PRD (ลำดับตามที่จับได้)
 */
function fisherYatesPick(pool, k) {
  const a = pool.slice()
  const out = []
  const n = Math.min(k, a.length)
  for (let i = 0; i < n; i++) {
    const j = i + cryptoRandomInt(a.length - i)
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
    out.push(a[i])
  }
  return out
}

/**
 * เลือกเลขไม่ซ้ำ k ตัวในช่วง [min, max] (inclusive)
 * - pool เล็ก: Fisher-Yates บน array จริง
 * - pool ใหญ่มาก: crypto + Set rejection (uniqueness เหมือนกัน, ไม่กิน memory)
 *
 * กรณี k > จำนวนเลขในช่วง (No Repeat): คืนได้สูงสุดเท่าที่ pool มี แล้วหยุด
 * (PRD §1.3 — silent, ไม่มี error)
 */
export function drawUnique(min, max, k) {
  const rangeSize = max - min + 1
  if (rangeSize <= 0 || k <= 0) return []

  // ถ้าขอมากกว่าหรือเท่ากับทั้ง pool → คืนทั้ง pool (สุ่มลำดับ)
  const take = Math.min(k, rangeSize)

  if (rangeSize <= FISHER_YATES_POOL_LIMIT) {
    const pool = new Array(rangeSize)
    for (let i = 0; i < rangeSize; i++) pool[i] = min + i
    return fisherYatesPick(pool, take)
  }

  // pool ใหญ่: เก็บค่าที่จับได้ลง Set, ชนแล้วจับใหม่ (rejection)
  const seen = new Set()
  const out = []
  while (out.length < take) {
    const v = min + cryptoRandomInt(rangeSize)
    if (!seen.has(v)) {
      seen.add(v)
      out.push(v)
    }
  }
  return out
}

/**
 * เลือกเลข k ตัวแบบ "ซ้ำได้" (Allow Repeat) ในช่วง [min, max]
 * แต่ละลูกสุ่มอิสระจาก crypto
 */
export function drawWithRepeat(min, max, k) {
  const rangeSize = max - min + 1
  if (rangeSize <= 0 || k <= 0) return []
  const out = []
  for (let i = 0; i < k; i++) {
    out.push(min + cryptoRandomInt(rangeSize))
  }
  return out
}

/** สุ่ม special ball 1 ลูก (Mega/Power) — ใช้ crypto เช่นกัน */
export function drawSpecial(min, max) {
  return min + cryptoRandomInt(max - min + 1)
}
