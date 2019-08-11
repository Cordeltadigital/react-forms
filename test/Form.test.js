import React from 'react'
import { createSetup } from './setup'
import { Form, Input, Textarea, Select, Submit, Button } from "../src";

const simpleForm = createSetup(({ props, spy }) =>
  <Form>
    <Input name="text" {...props} />
    <Submit onSubmit={spy} />
  </Form>
)
const delay = () => new Promise(r => setTimeout(r))

test("multiple elements", () => {
  const { change, submit, validateCalls } = createSetup(({ spy }) =>
    <Form>
      <Input name="input" />
      <Textarea name="textarea" />
      <Select name="select" options={['select']} />
      <Submit onSubmit={spy} />
    </Form>
  )()

  change('input', 'input', 'input')
  change('textarea', 'textarea', 'textarea')
  change('select', 'select', 'select')
  submit()

  validateCalls({
    input: 'input',
    textarea: 'textarea',
    select: 'select'
  })
})

test("validated class is appended to invalid form className when submitted", () => {
  const { submit, form } = simpleForm({ required: true })
  submit()
  expect(form.find('form').props().className).toContain('validated')
})

// need to move the submission handler to Form and make buttons dumb
// I can't get this to work anyway - maybe related to https://github.com/airbnb/enzyme/issues/308 or https://github.com/airbnb/enzyme/issues/1722
// test("submit button fires onClick when form is submitted", () => {
//   const { form, validateCalls } = simpleForm()
//   form.find('form').simulate('submit')
//   validateCalls({})
// })

test("object key path can be used to construct deep object", () => {
  const { submit, validateCalls } = simpleForm({ name: 'p1.p2', value: 'test' })
  submit()
  validateCalls({ p1: { p2: 'test' } })
})

test("non-submit button onClick handler does not validate and receives unvalidated values", () => {
  const { submit, validateCalls } = createSetup(({ spy }) =>
    <Form>
      <Input name="text" required />
      <Button onClick={spy} />
    </Form>
  )()
  submit()
  validateCalls({})
})

// debatable whether we should be doing this?
// test("button displays spinner until promise returned from onClick completes", () => {
//   let resolve
//   const handler = spy => () => (new Promise(r => resolve = r)).then(spy)
//   const { submit, validateCalls, form } = createSetup(({ spy }) =>
//     <Form>
//       <Input name="text" value="test" />
//       <Button onClick={handler(spy)} />
//     </Form>
//   )()
//
//   submit()
//   validateCalls()
//
//   // not sure why this fails yet - pretty sure it's working, but webstorm is not letting me debug enzyme tests at the moment...
//   expect(form.find('svg').length).toBe(1)
//
//   resolve()
//   return delay().then(() => {
//     validateCalls(undefined)
//     expect(form.find('svg').length).toBe(0)
//   })
// })

