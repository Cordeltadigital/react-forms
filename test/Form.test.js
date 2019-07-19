import React from 'react'
import enzyme from 'enzyme'
import { Form, Input, Textarea, Select, Submit } from "../src";

test("elements are rendered and values passed to onClick handler", () => {
  const spy = jest.fn()
  const form = enzyme.mount(
    <Form>
      <Input name="input" />
      <Textarea name="textarea" />
      <Select name="select" options={['select']} />
      <Submit onClick={spy} />
    </Form>
  )

  form.find('input[name="input"]').instance().value = 'input'
  form.find('input[name="input"]').simulate('change')
  form.find('textarea').instance().value = 'textarea'
  form.find('textarea').simulate('change')
  form.find('button').simulate('click')

  expect(spy.mock.calls).toEqual([[{
    input: 'input',
    textarea: 'textarea',
    select: 'select'
  }]])
})

// test("initial values are set and can be changed", () => {
//   FAILS!!! Initial values are not passed to submit handlers
// })
// test("values provides an accessor to form values", () => {})
// test("button displays spinner until promise returned from onClick completes", () => {})
// test("passing value prop to consumers sets initial value", () => {})
// test("html validation attributes prevent onClick handler from firing if invalid", () => {})
// test("validated class is appended to invalid element className", () => {})
// test("submit button fires onClick when enter is pressed while form is focused", () => {})
// test("object key path can be used to construct deep object")
// test("arbitrary props are passed to corresponding HTML elements")
// test("non-submit button onClick handler does not validate and receives unvalidated values")