/**
 * CSP-Compliant Table Component
 *
 * A replacement for React Bootstrap's Table that doesn't use inline styles,
 * making it compatible with strict Content Security Policy.
 */

import type { FC, ReactNode } from 'react'
import { classNames } from '@/utils/classNames'

type TableProps = {
  striped?: boolean
  bordered?: boolean
  hover?: boolean
  children: ReactNode
  className?: string
}

const CSPCompliantTable: FC<TableProps> = ({
  striped = false,
  bordered = false,
  hover = false,
  children,
  className = '',
}) => {
  const classes = classNames(
    'table',
    striped && 'table-striped',
    bordered && 'table-bordered',
    hover && 'table-hover',
    className,
  )

  return <table className={classes}>{children}</table>
}

export default CSPCompliantTable
