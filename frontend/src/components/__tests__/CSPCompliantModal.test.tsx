import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import CSPCompliantModal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from '@/components/CSPCompliantModal'

describe('CSPCompliantModal', () => {
  beforeEach(() => {
    document.body.classList.remove('modal-open')
  })

  afterEach(() => {
    document.body.classList.remove('modal-open')
  })

  test('does not render when show is false', () => {
    const { container } = render(
      <CSPCompliantModal show={false} onHide={vi.fn()}>
        <div>Modal Content</div>
      </CSPCompliantModal>
    )
    expect(container.firstChild).toBeNull()
  })

  test('renders when show is true', () => {
    render(
      <CSPCompliantModal show={true} onHide={vi.fn()}>
        <div>Modal Content</div>
      </CSPCompliantModal>
    )
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('adds modal-open class to body when shown', () => {
    render(
      <CSPCompliantModal show={true} onHide={vi.fn()}>
        <div>Content</div>
      </CSPCompliantModal>
    )
    expect(document.body).toHaveClass('modal-open')
  })

  test('removes modal-open class from body when hidden', () => {
    const { rerender } = render(
      <CSPCompliantModal show={true} onHide={vi.fn()}>
        <div>Content</div>
      </CSPCompliantModal>
    )
    expect(document.body).toHaveClass('modal-open')
    rerender(
      <CSPCompliantModal show={false} onHide={vi.fn()}>
        <div>Content</div>
      </CSPCompliantModal>
    )
    expect(document.body).not.toHaveClass('modal-open')
  })

  test('calls onHide when backdrop is clicked', async () => {
    const handleHide = vi.fn()
    const user = userEvent.setup()
    render(
      <CSPCompliantModal show={true} onHide={handleHide}>
        <div>Content</div>
      </CSPCompliantModal>
    )
    const backdrop = document.querySelector('.modal-backdrop')
    if (backdrop) {
      await user.click(backdrop as HTMLElement)
      expect(handleHide).toHaveBeenCalledTimes(1)
    }
  })

  test('applies size class', () => {
    const { container } = render(
      <CSPCompliantModal show={true} onHide={vi.fn()} size="sm">
        <div>Content</div>
      </CSPCompliantModal>
    )
    const dialog = container.querySelector('.modal-dialog')
    expect(dialog).toHaveClass('modal-sm')
  })

  test('applies centered class', () => {
    const { container } = render(
      <CSPCompliantModal show={true} onHide={vi.fn()} centered>
        <div>Content</div>
      </CSPCompliantModal>
    )
    const dialog = container.querySelector('.modal-dialog')
    expect(dialog).toHaveClass('modal-dialog-centered')
  })

  test('cleans up modal-open class on unmount', () => {
    const { unmount } = render(
      <CSPCompliantModal show={true} onHide={vi.fn()}>
        <div>Content</div>
      </CSPCompliantModal>
    )
    expect(document.body).toHaveClass('modal-open')
    unmount()
    expect(document.body).not.toHaveClass('modal-open')
  })
})

describe('ModalHeader', () => {
  test('renders children', () => {
    render(
      <ModalHeader>
        <div>Header Content</div>
      </ModalHeader>
    )
    expect(screen.getByText('Header Content')).toBeInTheDocument()
  })

  test('renders close button when closeButton prop is true', () => {
    render(
      <ModalHeader closeButton onHide={vi.fn()}>
        <div>Header</div>
      </ModalHeader>
    )
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  test('calls onHide when close button is clicked', async () => {
    const handleHide = vi.fn()
    const user = userEvent.setup()
    render(
      <ModalHeader closeButton onHide={handleHide}>
        <div>Header</div>
      </ModalHeader>
    )
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    expect(handleHide).toHaveBeenCalledTimes(1)
  })

  test('does not render close button when closeButton is false', () => {
    render(
      <ModalHeader closeButton={false} onHide={vi.fn()}>
        <div>Header</div>
      </ModalHeader>
    )
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })
})

describe('ModalBody', () => {
  test('renders children', () => {
    render(
      <ModalBody>
        <div>Body Content</div>
      </ModalBody>
    )
    expect(screen.getByText('Body Content')).toBeInTheDocument()
  })
})

describe('ModalFooter', () => {
  test('renders children', () => {
    render(
      <ModalFooter>
        <button>Save</button>
      </ModalFooter>
    )
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })
})

describe('ModalTitle', () => {
  test('renders children', () => {
    render(<ModalTitle>Title Text</ModalTitle>)
    expect(screen.getByText('Title Text')).toBeInTheDocument()
  })

  test('applies id attribute', () => {
    const { container } = render(<ModalTitle id="modal-title">Title</ModalTitle>)
    const title = container.querySelector('h5')
    expect(title).toHaveAttribute('id', 'modal-title')
  })

  test('renders as h5 element', () => {
    const { container } = render(<ModalTitle>Title</ModalTitle>)
    const title = container.querySelector('h5')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('modal-title')
  })
})

