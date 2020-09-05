import React from 'react'
import { act } from 'react-dom/test-utils'
import { createSetup } from './setup'
import { Form, Input, Textarea, Select, Submit, context } from '../src'
import FormProvider from '../src/Form'

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
      <Select name="select">
        <option>select</option>
      </Select>
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

test("additional context values are passed to consumers as props", () => {
  const CustomForm = FormProvider(context.Provider, { newprop: 2 })
  const { element } = createSetup(() =>
    <CustomForm>
      <Input name="text" />
      <Submit />
    </CustomForm>
  )()
  expect(element('input', 'text').props().newprop).toBe(2)
})

test("additional context values can be overridden with props on the form", () => {
  const CustomForm = FormProvider(context.Provider, { newprop: 2 })
  const { element } = createSetup(() =>
    <CustomForm newprop={3}>
      <Input name="text" />
      <Submit />
    </CustomForm>
  )()
  expect(element('input', 'text').props().newprop).toBe(3)
})

test("errors on submission cause error message to be displayed by default", () => {
  const { submit, form } = createSetup(() =>
    <Form onSubmit={() => { throw new Error('error message') }}>
      <Submit />
    </Form>
  )()
  submit()
  expect(form.find('.react-forms-error').text()).toBe('error message')
})

test("errors returned in promise on submission cause error message to be displayed by default", () => {
  const { submit, form } = createSetup(() =>
    <Form onSubmit={() => Promise.reject('rejected')}>
      <Submit />
    </Form>
  )()
  return act(() => {
    submit()
    return new Promise(r => setTimeout(r)).then(() => {
      form.update()
      expect(form.find('.react-forms-error').text()).toBe('rejected')
    })
  })
})

test("results with error property cause error property to be displayed", () => {
  const { submit, form } = createSetup(() =>
    <Form onSubmit={() => Promise.resolve({ error: 'test error' })}>
      <Submit />
    </Form>
  )()
  return act(() => {
    submit()
    return new Promise(r => setTimeout(r)).then(() => {
      form.update()
      expect(form.find('.react-forms-error').text()).toBe('test error')
    })
  })
})

test("results with success property set to false cause message property to be displayed", () => {
  const { submit, form } = createSetup(() =>
    <Form onSubmit={() => Promise.resolve({ success: false, message: 'test error' })}>
      <Submit />
    </Form>
  )()
  return act(() => {
    submit()
    return new Promise(r => setTimeout(r)).then(() => {
      form.update()
      expect(form.find('.react-forms-error').text()).toBe('test error')
    })
  })
})

test("form is reset after successful submission if resetOnSubmit is specified", () => {
  const { change, element, submit } = createSetup(({ props, spy }) =>
    <Form onSubmit={spy} resetOnSubmit>
      <Input name="text" {...props} />
      <Submit />
    </Form>
  )()
  change('input', 'text', 'some text')
  submit()
  expect(element('input', 'text').props().value).toBe('')
})

test("form is not reset if resetOnSubmit is false", () => {
  const { change, element, submit } = simpleForm()
  change('input', 'text', 'some text')
  submit()
  expect(element('input', 'text').props().value).toBe('some text')
})

test("form is reset to originally provided values", () => {
  const { change, element, submit } = createSetup(({ props, spy }) =>
    <Form onSubmit={spy} values={{ text: 'some text' }} resetOnSubmit>
      <Input name="text" {...props} />
      <Submit />
    </Form>
  )()
  change('input', 'text', 'changed')
  submit()
  expect(element('input', 'text').props().value).toBe('some text')
})

test("specifying row prop adds react-forms-row class", () => {
  const { form } = createSetup(() => <Form row />)()
  expect(form.find('form').hasClass('react-forms-row')).toBe(true)
})

test("interactive form elements are disabled until returned promise resolves", () => {
  let resolveSubmit
  const onSubmit = () => new Promise(resolve => resolveSubmit = resolve)

  const { form, submit } = createSetup(() =>
    <>
      <Form onSubmit={onSubmit}>
        <Input name="input" key={'Input'} className="interactive" />,
        <Textarea name="textarea" key={'Textarea'} className="interactive" />,
        <Select name="select" key={'Select'} className="interactive" />,
        <input key={'input'} className="interactive" />,
        <Submit key={'Submit'} className="interactive" />

        <p key={'p'} className="noninteractive">paragraph</p>,
        <span key={'span'} className="noninteractive">span</span>
      </Form>
      <input key={'external'} className="external" />
    </>
  )()

  const expectDisabled = disabled => {
    form.find('.interactive').forEach(x => expect(x.getDOMNode().disabled).toBe(disabled))
    form.find('.noninteractive').forEach(x => expect(x.getDOMNode().disabled).toBe(undefined))
    form.find('.external').forEach(x => expect(x.getDOMNode().disabled).toBe(false))
  }

  expectDisabled(false)
  submit()
  expectDisabled(true)
  resolveSubmit()

  return new Promise(resolve => setTimeout(resolve, 5))
    .then(() => expectDisabled(false))
})