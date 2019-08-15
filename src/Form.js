import React, { useReducer, createRef } from 'react'
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

  return (
    <form noValidate {...props} onSubmit={onSubmit} ref={form}>
      <ContextProvider {...props} value={{ registerFieldValidator, setFieldValue, getFieldValue, onSubmit }} />
      <input type="submit" style={{ visibility: 'hidden', position: 'absolute' }}/>
    </form>
  )
}
