import { render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../form'
import { Input } from '../input'

const TestForm = () => {
  const form = useForm()
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="test"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}

describe('Form', () => {
  it('renders form', () => {
    const { getByRole } = render(<TestForm />)
    expect(getByRole('textbox')).toBeInTheDocument()
  })
})
