import React from 'react'
import { Form, Submit, wrap } from '../src'
import { createSetup } from './setup'

const InputField = wrap(({ onChange, name, label, value, required, className }) => {
  return (
    <div className={className}>
      <label>{label}</label>
      <input name={name} onChange={onChange} value={value} required={required} />
    </div>
  )
})

const setup = createSetup(({ props, spy }) =>
  <Form>
    <InputField label="Text" name="text" {...props} />
    <Submit onClick={spy} />
  </Form>
)

test("custom component can be wrapped", () => {
  const { submit, change, validateCalls } = setup({ value: 'initial' })

  submit()
  change('input', 'text', 'changed')
  submit()

  validateCalls({ text: 'initial' }, { text: 'changed' })
})

test("arbitrary props are passed to element", () => {
  const { form } = setup({ prop1: 'abc', prop2: 2 })
  expect(form.find(InputField).props()).toMatchObject({ prop1: 'abc', prop2: 2 })
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

test("validated class is appended to element class when changed", () => {
  const { change, form } = setup({ required: true })
  change('input', 'text')
  expect(form.find('div').hasClass('validated')).toBe(true)
})

test("classes are appended correctly", () => {
  const { form } = setup({ className: 'my-class my-other-class' })
  expect(form.find('div').hasClass('my-class my-other-class')).toBe(true)
})
