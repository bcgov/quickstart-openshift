import type { FC } from 'react'
import type { AxiosResponse } from '~/axios'
import type UserDto from '@/interfaces/UserDto'
import { useEffect, useState, useCallback, useRef } from 'react'
import apiService from '@/service/api-service'

type ModalProps = {
  show: boolean
  onHide: () => void
  user?: UserDto
}

const ModalComponent: FC<ModalProps> = ({ show, onHide, user }) => {
  const modalRef = useRef<HTMLDialogElement>(null)
  const backdropRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  // Memoize ESC handler to prevent event listener issues
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onHide()
      }
    },
    [show, onHide],
  )

  useEffect(() => {
    if (show) {
      // Store ref value to avoid stale closure issues
      const dialogElement = modalRef.current
      if (!dialogElement) return

      // Store the previously focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement

      // Add event listeners
      document.addEventListener('keydown', handleEsc)
      document.body.classList.add('modal-open')

      // Show the dialog element and focus the close button
      if (typeof dialogElement.showModal === 'function') {
        dialogElement.showModal()
      }
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 0)

      // Focus trap: handle Tab key to keep focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !dialogElement) return

        const focusableElements = dialogElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        // Shift + Tab: if at first element, wrap to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
          return
        }

        // Tab: if at last element, wrap to first
        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }

      document.addEventListener('keydown', handleTabKey)

      return () => {
        document.removeEventListener('keydown', handleEsc)
        document.removeEventListener('keydown', handleTabKey)
        document.body.classList.remove('modal-open')
        // Close the dialog element (check if method exists for test compatibility)
        if (dialogElement && typeof dialogElement.close === 'function') {
          dialogElement.close()
        }
        // Return focus to previously focused element
        previouslyFocusedElement.current?.focus()
      }
    } else {
      // Close dialog when show becomes false (check if method exists for test compatibility)
      const dialogElement = modalRef.current
      if (dialogElement && typeof dialogElement.close === 'function') {
        dialogElement.close()
      }
    }
  }, [show, handleEsc])

  // Handle backdrop click - only close if clicking the backdrop itself, not dragging from modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.target === e.currentTarget) {
      onHide()
    }
  }

  // Handle backdrop keyboard interaction for accessibility
  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onHide()
    }
  }

  const handleBackdropKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Ensure keyboard events are properly handled
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <>
      <button
        ref={backdropRef}
        type="button"
        className="modal-backdrop fade show"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
        onKeyUp={handleBackdropKeyUp}
        aria-label="Close modal"
      ></button>
      <dialog
        ref={modalRef}
        className="modal fade show"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="contained-modal-title-vcenter">
                Row Details
              </h5>
              <button
                ref={closeButtonRef}
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{JSON.stringify(user)}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}

const Dashboard: FC = () => {
  const [data, setData] = useState<any>([])
  const [selectedUser, setSelectedUser] = useState<UserDto | undefined>(undefined)

  useEffect(() => {
    apiService
      .getAxiosInstance()
      .get('/v1/users')
      .then((response: AxiosResponse) => {
        const users: UserDto[] = []
        for (const user of response.data) {
          const userDto = {
            id: user.id,
            name: user.name,
            email: user.email,
          }
          users.push(userDto)
        }
        setData(users)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const handleClose = () => {
    setSelectedUser(undefined)
  }

  return (
    <div className="min-vh-45 mh-45 mw-50 ml-4">
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Email</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((user: UserDto) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className="text-center">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedUser(user)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalComponent show={!!selectedUser} onHide={handleClose} user={selectedUser} />
    </div>
  )
}

export default Dashboard
