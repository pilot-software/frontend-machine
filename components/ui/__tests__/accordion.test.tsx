import { render, screen } from '@testing-library/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../accordion'

describe('Accordion', () => {
  it('renders accordion', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })
})
