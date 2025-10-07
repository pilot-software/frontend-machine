import { render } from '@testing-library/react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../command'

describe('Command', () => {
  it('renders command palette', () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
    expect(container).toBeInTheDocument()
  })
})
