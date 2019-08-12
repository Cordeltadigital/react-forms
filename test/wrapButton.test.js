import React from 'react'
import { Form, Input, wrapButton } from '../src'
import { createSetup } from './setup'

const AnchorSubmit = wrapButton(props => <a href="#" {...props} />)

const setup = createSetup(({ spy }) =>
  <Form>
    <Input name="text" value="initial" />
    <AnchorSubmit onClick={spy}>Submit</AnchorSubmit>
  </Form>
)

test("custom button can be wrapped", () => {
  const { submit, change, validateCalls } = setup()

  submit('a')
  change('input', 'text', 'changed')
  submit('a')

  validateCalls({ text: 'initial' }, { text: 'changed' })
})
