/**
 * CSP-Compliant Button Component
 *
 * A replacement for React Bootstrap's Button that doesn't use inline styles,
 * making it compatible with strict Content Security Policy.
 */

import type { FC, ReactNode, ButtonHTMLAttributes } from 'react'
import { classNames } from '@/utils/classNames'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link'
  size?: 'sm' | 'lg'
  children: ReactNode
}

const CSPCompliantButton: FC<ButtonProps> = ({
  variant = 'primary',
  size,
  children,
  className = '',
  ...props
}) => {
  const classes = classNames('btn', `btn-${variant}`, size && `btn-${size}`, className)

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default CSPCompliantButton
