import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import CSPCompliantTable from '@/components/CSPCompliantTable'

describe('CSPCompliantTable', () => {
  test('renders table with children', () => {
    render(
      <CSPCompliantTable>
        <tbody>
          <tr>
            <td>Test</td>
          </tr>
        </tbody>
      </CSPCompliantTable>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  test('applies base table class', () => {
    const { container } = render(
      <CSPCompliantTable>
        <tbody />
      </CSPCompliantTable>
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('table')
  })

  test('applies striped class when striped prop is true', () => {
    const { container } = render(
      <CSPCompliantTable striped>
        <tbody />
      </CSPCompliantTable>
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('table-striped')
  })

  test('applies bordered class when bordered prop is true', () => {
    const { container } = render(
      <CSPCompliantTable bordered>
        <tbody />
      </CSPCompliantTable>
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('table-bordered')
  })

  test('applies hover class when hover prop is true', () => {
    const { container } = render(
      <CSPCompliantTable hover>
        <tbody />
      </CSPCompliantTable>
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('table-hover')
  })

  test('applies multiple classes when multiple props are true', () => {
    const { container } = render(
      <CSPCompliantTable striped bordered hover>
        <tbody />
      </CSPCompliantTable>
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('table', 'table-striped', 'table-bordered', 'table-hover')
  })

  test('applies custom className', () => {
    const { container } = render(
      <CSPCompliantTable className="custom-table">
        <tbody />
      </CSPCompliantTable>
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('custom-table')
  })

  test('does not apply optional classes when props are false', () => {
    const { container } = render(
      <CSPCompliantTable striped={false} bordered={false} hover={false}>
        <tbody />
      </CSPCompliantTable>
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('table')
    expect(table).not.toHaveClass('table-striped', 'table-bordered', 'table-hover')
  })
})

