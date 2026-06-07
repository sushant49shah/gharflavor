import { useEffect } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  X,
} from 'lucide-react'

interface DialogBoxProps {
  isOpen: boolean
  onClose: () => void

  title: string
  message: string

  type?: 'success' | 'error' | 'warning' | 'info'

  confirmText?: string
  cancelText?: string

  onConfirm?: () => void
  showCancel?: boolean

  loading?: boolean
}

const iconMap = {
  success: <CheckCircle2 className="h-7 w-7 text-emerald-400" />,
  error: <XCircle className="h-7 w-7 text-red-400" />,
  warning: <AlertTriangle className="h-7 w-7 text-yellow-400" />,
  info: <Info className="h-7 w-7 text-primary" />,
}

export default function DialogBox({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = true,
  loading = false,
}: DialogBoxProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-[#181818]
          p-6
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl
                border border-primary/20
                bg-primary/10
              "
            >
              {iconMap[type]}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-text-muted
              transition
              hover:bg-white/5
              hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Message */}
        <p className="mt-5 leading-7 text-text-muted">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="
                rounded-xl
                border
                border-white/10
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-white/5
              "
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              rounded-xl
              bg-primary
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:brightness-110
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}