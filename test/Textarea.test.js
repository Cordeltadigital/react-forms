import React from 'react'
import { createSetup } from './setup'
import { Form, Textarea, Submit } from '../src'

const setup = createSetup(({ props, spy }) => (
  <Form>
    <Textarea name="text" {...props} />
    <Submit onSubmit={spy} />
  </Form>
))

test("initial values are set and can be changed", () => {
  const { submit, change, validateCalls } = setup({ value: 'initial' })

  submit()
  change('textarea', 'text', 'changed')
  submit()

  validateCalls({ text: 'initial' }, { text: 'changed' })
})

test("arbitrary props are passed to element", () => {
  const { element } = setup({ prop1: 'abc', prop2: 2 })
  expect(element('textarea', 'text').props())
    .toMatchObject({ prop1: 'abc', prop2: 2 })
})

test("html validation attributes prevent onClick handler from firing if invalid", () => {
  const { submit, change, validateCalls } = setup({ required: true })

  submit()
  change('textarea', 'text', 'changed')
  submit()
  change('textarea', 'text', '')
  submit()

  validateCalls({ text: 'changed' })
})

test("validated class is appended to invalid element className", () => {
  const { change, element } = setup({ required: true })
  change('textarea', 'text')
  expect(element('textarea', 'text').props().className).toContain('validated')
})

test("classes are appended correctly", () => {
  const { element } = setup({ className: 'my-class my-other-class' })
  expect(element('textarea', 'text').props().className).toContain('my-class my-other-class')
})
