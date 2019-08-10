import React from 'react'
import { createSetup } from './setup'
import { Form, Input, Submit } from '../src'

const setup = createSetup(({ props, spy }) => (
  <Form>
    <Input name="text" {...props} />
    <Submit onClick={spy} />
  </Form>
))

test("initial values are set and can be changed", () => {
  const { submit, change, validateCalls } = setup({ value: 'initial' })

  submit()
  change('input', 'text', 'changed')
  submit()

  validateCalls({ text: 'initial' }, { text: 'changed' })
})

test("arbitrary props are passed to element", () => {
  const { element } = setup({ prop1: 'abc', prop2: 2 })
  expect(element('input', 'text').props())
    .toMatchObject({ prop1: 'abc', prop2: 2 })
})

test("html validation attributes prevent onClick handler from firing if invalid", () => {
  const { submit, change, validateCalls } = setup({ required: true })

  submit()
  change('input', 'text', 'changed')
  submit()
  change('input', 'text', '')
  submit()

  validateCalls({ text: 'changed' })
})

// doesn't work???
// test("minLength attribute", () => {
//   const { submit, change, validateCalls } = setup({ required: true, minLength: 2 })
//
//   submit()
//   change('input', 'text', 'changed')
//   submit()
//   change('input', 'text', 'a')
//   submit()
//
//   validateCalls({ text: 'changed' })
// })

test("validated class is appended to invalid element className", () => {
  const { change, element } = setup({ required: true })
  change('input', 'text')
  expect(element('input', 'text').props().className).toContain('validated')
})

test("classes are appended correctly", () => {
  const { element } = setup({ className: 'my-class my-other-class' })
  expect(element('input', 'text').props().className).toContain('my-class my-other-class')
})

// we should write a bunch of tests for radio button special handling if we leave it in
// test("radio buttons set initial value from checked attribute")
