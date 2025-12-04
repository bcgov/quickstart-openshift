/**
 * CSP-Compliant Modal Component
 *
 * A replacement for React Bootstrap's Modal that doesn't use inline styles,
 * making it compatible with strict Content Security Policy.
 *
 * This component uses CSS classes instead of inline styles for all positioning
 * and styling, allowing it to work with CSP that doesn't allow 'unsafe-inline'.
 */

import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

type ModalProps = {
  show: boolean
  onHide: () => void
  size?: 'sm' | 'lg' | 'xl'
  centered?: boolean
  children: ReactNode
}

const CSPCompliantModal: FC<ModalProps> = ({
  show,
  onHide,
  size = 'lg',
  centered = false,
  children,
}) => {
  useEffect(() => {
    // Prevent body scroll when modal is open using CSS class instead of inline style
    if (show) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [show])

  if (!show) {
    return null
  }

  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'xl' ? 'modal-xl' : ''

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop show"
        onClick={onHide}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        className={`modal show ${centered ? 'modal-centered' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          // Close when clicking outside modal content
          if (e.target === e.currentTarget) {
            onHide()
          }
        }}
      >
        <div className={`modal-dialog ${centered ? 'modal-dialog-centered' : ''} ${sizeClass}`}>
          <div className="modal-content">{children}</div>
        </div>
      </div>
    </>
  )
}

type ModalHeaderProps = {
  closeButton?: boolean
  onHide?: () => void
  children: ReactNode
}

export const ModalHeader: FC<ModalHeaderProps> = ({ closeButton = false, onHide, children }) => {
  return (
    <div className="modal-header">
      {children}
      {closeButton && onHide && (
        <button type="button" className="btn-close" onClick={onHide} aria-label="Close" />
      )}
    </div>
  )
}

type ModalBodyProps = {
  children: ReactNode
}

export const ModalBody: FC<ModalBodyProps> = ({ children }) => {
  return <div className="modal-body">{children}</div>
}

type ModalFooterProps = {
  children: ReactNode
}

export const ModalFooter: FC<ModalFooterProps> = ({ children }) => {
  return <div className="modal-footer">{children}</div>
}

type ModalTitleProps = {
  id?: string
  children: ReactNode
}

export const ModalTitle: FC<ModalTitleProps> = ({ id, children }) => {
  return (
    <h5 className="modal-title" id={id}>
      {children}
    </h5>
  )
}

// Export the modal and its subcomponents
CSPCompliantModal.Header = ModalHeader
CSPCompliantModal.Body = ModalBody
CSPCompliantModal.Footer = ModalFooter
CSPCompliantModal.Title = ModalTitle

export default CSPCompliantModal

