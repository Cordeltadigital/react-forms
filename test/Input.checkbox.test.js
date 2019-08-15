import React from 'react'
import { createSetup } from './setup'
import { Form, Input, Submit } from '../src'

const setup = createSetup(({ props, spy }) => (
  <Form onSubmit={spy}>
    <Input name="check" type="checkbox" {...props} />
    <Submit />
  </Form>
))

test("initial values are set and can be changed", () => {
  const { click, submit, validateCalls } = setup({ checked: true })

  submit()
  click('input', 'check', { target: { checked: false } })
  submit()

  validateCalls({ check: true }, { check: false })
})

test("passing a value causes output value to alternate between undefined and that value", () => {
  const { click, submit, validateCalls } = setup({ checked: true, value: 'yes' })

  // I don't think enzyme handles check boxes correctly... double check this...
  submit()
  click('input', 'check', { target: { checked: false } })
  submit()
  click('input', 'check', { target: { checked: true } })
  submit()

  validateCalls({ check: 'yes' }, { check: undefined }, { check: 'yes' })
})

test("arbitrary props are passed to element", () => {
  const { element } = setup({ prop1: 'abc', prop2: 2 })
  expect(element('input', 'check').props())
    .toMatchObject({ prop1: 'abc', prop2: 2 })
})

test("classes are appended correctly", () => {
  const { element } = setup({ className: 'my-class my-other-class' })
  expect(element('input', 'check').props().className).toContain('my-class my-other-class')
})

test("passing numeric prop coerces values to numbers", () => {
  const { submit, validateCalls } = setup({ numeric: true, checked: true, value: '2' })
  submit()
  validateCalls({ check: 2 })
})
