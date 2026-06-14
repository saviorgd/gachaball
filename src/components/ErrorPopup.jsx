import { motion, AnimatePresence } from 'framer-motion'

// ErrorPopup (PRD §1.3) — pop-up เมื่อกด Draw ตอน Custom config ไม่ถูกต้อง (เช่น Min > Max)
export default function ErrorPopup({ open, message, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="alertdialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-[320px] rounded-2xl bg-white p-5 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-sm text-[#1A1A1A]">{message}</p>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#1A1A1A] py-2.5 text-sm font-semibold text-white"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
