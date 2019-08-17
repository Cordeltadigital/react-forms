import React from 'react'
import { createSetup } from './setup'
import { Form, Input, Textarea, Select, Submit } from '../src'

const simpleForm = createSetup(({ props, spy }) =>
  <Form onSubmit={spy}>
    <Input name="text" {...props} />
    <Submit />
  </Form>
)

// we should do a validation that the form element values are correct, too...

test("multiple elements", () => {
  const { change, submit, validateCalls } = createSetup(({ spy }) =>
    <Form onSubmit={spy}>
      <Input name="input" />
      <Textarea name="textarea" />
      <Select name="select" options={['select']} />
      <Submit />
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

test("onSubmit is fired when form submit event is raised manually", () => {
  const { form, validateCalls } = simpleForm()
  form.find('form').simulate('submit')
  validateCalls({})
})

test("object key path can be used to construct deep object", () => {
  const { submit, validateCalls } = simpleForm({ name: 'p1.p2', value: 'test' })
  submit()
  validateCalls({ p1: { p2: 'test' } })
})

test("values can be set from prop passed to Form component", () => {
  const { change, submit, validateCalls } = createSetup(({ spy }) =>
    <Form onSubmit={spy} values={{ text: 'initial', check1: true, check2: undefined, radio: '2' }}>
      <Input name="text" />
      <Input name="check1" type="checkbox" />
      <Input name="check2" type="checkbox" value="test" />
      <Input name="radio" type="radio" value="1" checked />
      <Input name="radio" type="radio" value="2" />
      <Input name="radio" type="radio" value="3" />
      <Submit />
    </Form>
  )()

  submit()
  change('input', 'text', 'changed')
  submit()

  validateCalls(
    { text: 'initial', check1: true, check2: undefined, radio: '2' },
    { text: 'changed', check1: true, check2: undefined, radio: '2' }
  )
})
