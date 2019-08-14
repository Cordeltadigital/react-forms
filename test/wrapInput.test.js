import React from 'react'
import { Form, Submit, wrapInput } from '../src'
import { createSetup } from './setup'

const InputField = wrapInput(({ onChange, name, label, value, required, className }) =>
  <div className={className}>
    <label>{label}</label>
    <input name={name} onChange={onChange} value={value} required={required} />
  </div>
)

const setup = createSetup(({ props, spy }) =>
  <Form onSubmit={spy}>
    <InputField label="Text" name="text" {...props} />
    <Submit />
  </Form>
)

test("custom component can be wrapped", () => {
  const { submit, change, validateCalls } = setup({ value: 'initial' })

  submit()
  change('input', 'text', 'changed')
  submit()

  validateCalls({ text: 'initial' }, { text: 'changed' })
})

test("arbitrary props are passed to custom component", () => {
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

test("validated is appended to custom component className when changed", () => {
  const { change, form } = setup({ required: true })
  change('input', 'text')
  expect(form.find('div').hasClass('validated')).toBe(true)
})

test("classes are appended correctly to custom component className", () => {
  const { form } = setup({ className: 'my-class my-other-class' })
  expect(form.find('div').hasClass('my-class my-other-class')).toBe(true)
})

test("valueFromEvent option allows specifying input value", () => {
  const CustomInput = wrapInput(
    props => <input {...props} />,
    { valueFromEvent: event => 'test' }
  )
  const { submit, change, validateCalls } = createSetup(({ spy }) =>
    <Form onSubmit={spy}>
      <CustomInput name="text" />
      <Submit />
    </Form>
  )()

  change('input', 'text', 'changed')
  submit()
  validateCalls({ text: 'test' })
})

const defaultValueInput = defaultValue => wrapInput(props => <input {...props} />, { defaultValue })
const defaultValueSetup = defaultValue => createSetup(({ spy, props }) => {
  const DefaultValueInput = defaultValueInput(defaultValue)
  return (
    <Form onSubmit={spy}>
      <DefaultValueInput name="text" {...props} />
      <Submit/>
    </Form>
  )
})

test("initialValue prop allows specifying initial value from scalar", () => {
  const { submit, validateCalls } = defaultValueSetup('test')()
  submit()
  validateCalls({ text: 'test' })
})

test("initialValue prop allows specifying initial value from function", () => {
  const { submit, validateCalls } = defaultValueSetup(props => props['data-default'])({ 'data-default': 'test' })
  submit()
  validateCalls({ text: 'test' })
})

// enzyme does not support the :invalid pseudo class used by the input wrapper...
// test("error prop is set on invalid components if field is invalid", () => {
//   const InputWithError = wrapInput(props => <input name="test" {...props} required />, { passErrorProp: true })
//   const { submit, form, spy } = createSetup(props =>
//     <Form onSubmit={spy}>
//       <InputWithError name="test" required />
//       <Submit />
//     </Form>
//   )()
//
//   submit()
//   expect(form.find('input[name="test"]').props()['error']).toBe(true)
// })