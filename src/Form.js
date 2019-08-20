import { createElement, createRef, useReducer } from 'react'
import { keyPath } from './keyPath'

export default ContextProvider => props => {
  const [fieldValues, setFieldValue] = useReducer((values, field) => ({ ...values, ...field }), props.values || {})
  const [fieldValidators, registerFieldValidator] = useReducer((validators, validator) => [...validators, validator], [])
  const form = createRef()

  const getFieldValue = name => fieldValues[name]
  const getFieldValues = () => Object.keys(fieldValues).reduce(
    (values, name) => keyPath.set(name, { ...values }, fieldValues[name]),
    {}
  )

  const onSubmit = e => {
    fieldValidators.forEach(setFieldValidated => setFieldValidated())

    if(form.current.checkValidity() && props.onSubmit) {
      props.onSubmit(getFieldValues())
      // TODO: `resetOnSubmit` option
    }

    e.preventDefault()
  }

  const className = `react-forms ${props.className || ''}`

  return (
    createElement('form', { ...props, className, noValidate: true, onSubmit: onSubmit, ref: form, children: [
      createElement(ContextProvider, { ...props, key: 'context', value: { registerFieldValidator, setFieldValue, getFieldValue, onSubmit } }),
      createElement('input', { key: 'submit', type: 'submit', style: { visibility: 'hidden', position: 'absolute' } })
    ] })
  )
}
