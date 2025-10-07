import { render, screen } from '@testing-library/react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select'

describe('Select', () => {
  it('renders select component', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByText('Select')).toBeInTheDocument()
  })
})
