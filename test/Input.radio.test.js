import React from 'react'
import { createSetup } from './setup'
import { Form, Input, Submit } from '../src'

test("radio buttons set initial value and can be changed", () => {
  const { form, submit, validateCalls } = createSetup(({ spy }) =>
    <Form onSubmit={spy}>
      <Input type="radio" name="value" value="1" checked />
      <Input type="radio" name="value" value="2" />
      <Input type="radio" name="value" value="3" />
      <Submit />
    </Form>
  )()

  submit()
  form.find('input').at(1).simulate('click').simulate('change')
  submit()
  validateCalls({ value: '1' }, { value: '2' })
})

test("radio button required", () => {
  const { form, submit, validateCalls } = createSetup(({ spy }) =>
    <Form onSubmit={spy}>
      <Input type="radio" name="value" value="1" required />
      <Input type="radio" name="value" value="2" required />
      <Submit />
    </Form>
  )()

  submit()
  form.find('input').at(1).simulate('click').simulate('change')
  submit()
  validateCalls({ value: '2' })
})

test("numeric prop", () => {
  const { form, submit, validateCalls } = createSetup(({ spy }) =>
    <Form onSubmit={spy}>
      <Input type="radio" name="value" value="1" numeric checked />
      <Input type="radio" name="value" value="2" numeric />
      <Submit />
    </Form>
  )()

  submit()
  form.find('input').at(1).simulate('click').simulate('change')
  submit()
  validateCalls({ value: 1 }, { value: 2 })
})