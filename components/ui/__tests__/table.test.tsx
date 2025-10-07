import { render, screen } from '@testing-library/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../table'

describe('Table', () => {
  it('renders complete table structure', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders multiple rows', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row 1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Row 1')).toBeInTheDocument()
    expect(screen.getByText('Row 2')).toBeInTheDocument()
  })

  it('applies custom className to table', () => {
    const { container } = render(<Table className="custom"><TableBody /></Table>)
    expect(container.querySelector('table')).toHaveClass('custom')
  })
})
