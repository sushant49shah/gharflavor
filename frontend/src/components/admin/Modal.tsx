import { type MouseEvent, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

// Purpose: Simple modal overlay for admin dialogs and forms.
// Props:
//   isOpen - whether the modal is visible.
//   title - dialog heading.
//   onClose - callback to close the modal.
//   children - modal content.
// Usage: Wrap form or details content in <Modal> inside admin pages.
const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  if (!isOpen) return null

  const onOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-5" onClick={onOverlayClick}>
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-bg-dark shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="rounded-xl bg-bg-surface/60 hover:bg-bg-surface/80 px-4 py-2 text-sm font-semibold text-text-base transition-colors">
            Close
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
