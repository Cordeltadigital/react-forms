import React from 'react'
import { createSetup } from './setup'
import { Form, Select, Submit } from '../src'

const setup = createSetup(({ props, spy }) => (
  <Form onSubmit={spy}>
    <Select name="value" options={['1', '2', '3']} {...props} />
    <Submit />
  </Form>
))

const useChildren = createSetup(({ spy, props }) => (
  <Form onSubmit={spy}>
    <Select name="value" {...props}>
      <option>1</option>
      <option>2</option>
      <option>3</option>
    </Select>
    <Submit />
  </Form>
))

test("initial values are set and can be changed", () => {
  const { submit, change, validateCalls } = setup({ value: '1' })

  submit()
  change('select', 'value', '2')
  submit()

  validateCalls({ value: '1' }, { value: '2' })
})

test("initial values are set and can be changed using children", () => {
  const { submit, change, validateCalls } = setup({ value: '1' })

  submit()
  change('select', 'value', '2')
  submit()

  validateCalls({ value: '1' }, { value: '2' })
})

test("first value is selected by default when options prop is passed to match browser behavior", () => {
  const { submit, validateCalls } = setup()
  submit()
  validateCalls({ value: '1' })
})

// this does work in the browser... another enzyme / jsdom limitation?
// test("first value is selected by default when options children are used to match browser behavior", () => {
//   const { submit, validateCalls } = useChildren()
//   submit()
//   validateCalls({ value: '1' })
// })

test("arbitrary props are passed to element", () => {
  const { element } = setup({ prop1: 'abc', prop2: 2 })
  expect(element('select', 'value').props())
    .toMatchObject({ prop1: 'abc', prop2: 2 })
})

test("html validation attributes prevent onClick handler from firing if invalid", () => {
  const { submit, change, validateCalls } = setup({ required: true, options: ['', '1', '2', '3'] })

  submit()
  change('select', 'value', '1')
  submit()
  change('select', 'value', '')
  submit()

  validateCalls({ value: '1' })
})

test("validated class is appended to invalid element className", () => {
  const { change, element } = setup({ required: true })
  change('select', 'value')
  expect(element('select', 'value').props().className).toContain('validated')
})

test("classes are appended correctly", () => {
  const { element } = setup({ className: 'my-class my-other-class' })
  expect(element('select', 'value').props().className).toContain('my-class my-other-class')
})

test("value attribute can be used", () => {
  const { submit, change, validateCalls } = createSetup(({ spy }) => (
    <Form onSubmit={spy}>
      <Select name="value" value="1">
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Select>
      <Submit />
    </Form>
  ))()

  submit()
  change('select', 'value', '2')
  submit()

  validateCalls({ value: '1' }, { value: '2' })
})

