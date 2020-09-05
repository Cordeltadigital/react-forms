import React from 'react'
import { createSetup } from './setup'
import { Form, Input, Submit } from '../src'
import { act } from 'react-dom/test-utils'

const setup = createSetup(({ props, spy }) => (
  <Form onSubmit={spy}>
    <Input name="text" {...props} />
    <Submit />
  </Form>
))

test("initial values are set and can be changed", () => {
  const { element, submit, change, validateCalls } = setup({ value: 'initial' })

  expect(element('input', 'text').instance().value).toBe('initial')
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

// works in browser - not sure if due to lack of enzyme / jsdom support?
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

test("initial value can be set using defaultValue prop", () => {
  const { submit, validateCalls } = setup({ defaultValue: 'initial' })
  submit()
  validateCalls({ text: 'initial' })
})

test("passing numeric prop coerces values to numbers", () => {
  const { submit, change, validateCalls } = setup({ numeric: true })

  change('input', 'text', '3.5')
  submit()

  validateCalls({ text: 3.5 })
})

test("initial value of empty string is preserved", () => {
  const { submit, validateCalls } = setup({ value: '' })
  submit()
  validateCalls({ text: '' })
})

test("default value of empty string is preserved", () => {
  const { submit, validateCalls } = setup({ defaultValue: '' })
  submit()
  validateCalls({ text: '' })
})

test("submitOnChange causes form to be submitted on every field change", () => {
  const { change, validateCalls } = createSetup(({ spy }) => (
    <Form onSubmit={spy}>
      <Input name="text" submitOnChange />
    </Form>
  ))()

  return act(() => {
    change('input', 'text', 'test')

    return (new Promise(resolve => setTimeout(resolve))).then(() => {
      validateCalls({ text: 'test' })
    })
  })
})

test("submitOnBlur causes form to be submitted when blur event occurs", () => {
  const { change, element, validateCalls } = createSetup(({ spy }) => (
    <Form onSubmit={spy}>
      <Input name="text" submitOnBlur />
    </Form>
  ))()

  change('input', 'text', 'test')
  element('input', 'text').simulate('blur')

  validateCalls({ text: 'test' })
})

test("input can be controlled using value prop", () => {
  const Container = ({ value, spy }) => (
    <Form onSubmit={spy}>
      <Input name="text" value={value} />
      <Submit>Submit</Submit>
    </Form>
  )

  const { form, element, change, validateCalls, submit } = createSetup(({ props, spy }) => (
    <Container value={props.value} spy={spy} />
  ))({})

  const input = element('input', 'text')

  expect(input.instance().value).toBe('')
  submit()
  validateCalls({ text: undefined })

  form.setProps({ value: 'test' })
  form.update()
  expect(input.instance().value).toBe('test')
  submit()
  validateCalls({ text: undefined }, { text: 'test' })

  change('input', 'text', 'test2')
  submit()
  validateCalls({ text: undefined }, { text: 'test' }, { text: 'test2' })
})

// test("provided id is preserved")