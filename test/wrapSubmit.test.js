import React from 'react'
import { Form, Input, wrapSubmit } from '../src'
import { createSetup } from './setup'

const AnchorSubmit = wrapSubmit(props => <a {...props} />)

const setup = createSetup(({ spy }) =>
  <Form onSubmit={spy}>
    <Input name="text" value="initial" />
    <AnchorSubmit>Submit</AnchorSubmit>
  </Form>
)

test("custom button can be wrapped", () => {
  const { submit, change, validateCalls } = setup()

  submit('a')
  change('input', 'text', 'changed')
  submit('a')

  validateCalls({ text: 'initial' }, { text: 'changed' })
})
