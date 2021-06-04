import React from 'react'
import { createSetup } from './setup'
import { Form, Input, Submit, useFormValues } from '../src'

const setup = createSetup(({ props, spy }) => {
  const Child = () => {
    const values = useFormValues()
    return <div>{values.text}</div>
  }
  return (
    <Form onSubmit={spy}>
      <Input name="text" {...props} />
      <Submit />
      <Child />
    </Form>
  )
})

test("useFormValues component exposes field values", () => {
  const { form, change } = setup({ value: 'initial' })

  expect(form.find('div').text()).toBe('initial')
  change('input', 'text', 'changed')
  expect(form.find('div').text()).toBe('changed')
})