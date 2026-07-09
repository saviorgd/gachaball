// ---------------------------------------------------------------------------
// นิยามของแต่ละโหมด (PRD §1.1 + §2.5)
// แยก config ออกมาเป็นไฟล์เดียว เพื่อให้ engineer แก้ช่วงเลข/สีได้ที่จุดเดียว
// ---------------------------------------------------------------------------

export const MODES = {
  megamillions: {
    id: 'megamillions',
    label: 'Mega Millions',
    white: { min: 1, max: 70, count: 5 }, // 5 ลูก จาก 1–70
    special: { min: 1, max: 24, label: 'Mega Ball', buttonLabel: 'Draw Mega Ball' },
    theme: {
      cardBg: '#1a3a6b', // deep blue
      drawButton: '#f5c518', // yellow
      drawButtonText: '#1A1A1A', // text dark
      specialBall: '#f5c518',
      specialBallText: '#1A1A1A',
      whiteBallText: '#1A1A1A',
      text: '#FFFFFF', // ตัวหนังสือบน card เป็นสีอ่อนให้อ่านบนพื้น deep blue
      placeholderText: 'dark',
    },
  },

  powerball: {
    id: 'powerball',
    label: 'Powerball',
    white: { min: 1, max: 69, count: 5 }, // 5 ลูก จาก 1–69
    special: { min: 1, max: 26, label: 'Power Ball', buttonLabel: 'Draw Power Ball' },
    theme: {
      cardBg: '#7b1a1a', // crimson
      drawButton: '#c0392b', // red
      drawButtonText: '#FFFFFF', // text white
      specialBall: '#e74c3c',
      specialBallText: '#FFFFFF',
      whiteBallText: '#1A1A1A',
      text: '#FFFFFF', // White
      placeholderText: 'light',
    },
  },

  custom: {
    id: 'custom',
    label: 'Custom',
    // ค่า white จริงมาจาก config ที่ผู้ใช้กรอก (ดู defaults ด้านล่าง)
    white: null,
    special: null, // Custom ไม่มี special ball
    theme: {
      cardBg: '#1A1A1A', // neutral dark
      drawButton: '#444444',
      drawButtonText: '#FFFFFF', // text white
      specialBall: '#888888',
      specialBallText: '#FFFFFF',
      whiteBallText: '#1A1A1A',
      text: '#FFFFFF', // White
      placeholderText: 'light',
    },
  },
}

export const MODE_ORDER = ['megamillions', 'powerball', 'custom']

// ค่าเริ่มต้นของ Custom (PRD §1.1, §2.6)
export const CUSTOM_DEFAULTS = {
  min: 0,
  max: 9,
  count: 6,
  repeatMode: 'allow-repeat', // 'no-repeat' | 'allow-repeat' (default)
}

export const INPUT_MAX_LENGTH = 28 // PRD §1.1, §1.3
export const CUSTOM_MAX_DRAWS = 30
export const SESSION_TAB_KEY = 'gachaball:last-tab' // PRD §1.4
