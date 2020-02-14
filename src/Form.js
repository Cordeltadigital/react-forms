import { createElement, createRef, useReducer, useState } from 'react'
import { keyPath } from './keyPath'

export default (ContextProvider, additionalContext = {}, ErrorMessage) => ({ resetOnSubmit, ...props }) => {
  const [fieldValues, setFieldValues] = useState(props.values || {})
  const [fieldValidators, registerFieldValidator] = useReducer((validators, validator) => [...validators, validator], [])
  const [error, setError] = useState()
  const form = createRef()

  const getFieldValue = name => fieldValues[name]
  const getFieldValues = () => Object.keys(fieldValues).reduce(
    (values, name) => keyPath.set(name, { ...values }, fieldValues[name]),
    {}
  )

  const setFieldValue = field => setFieldValues({ ...fieldValues, ...field })

  const onSubmit = e => {
    fieldValidators.forEach(setFieldValidated => setFieldValidated())

    if(form.current.checkValidity() && props.onSubmit) {
      setError()
      try {
        const reset = () => {
          if(resetOnSubmit) {
            setFieldValues(props.values || {})
          }
        }

        const result = props.onSubmit(getFieldValues())
          if(result && typeof result.then === 'function') {
            result.then(reset).catch(error => setError(error))
          } else {
            reset()
          }
      } catch(error) {
        setError(error)
      }
    }

    e.preventDefault()
  }

  const className = `react-forms ${props.className || ''}`

  const mergedAdditionalContext = Object.keys(additionalContext).reduce(
    (result, property) => ({ ...result, [property]: props[property] || additionalContext[property] }),
    {}
  )

  return (
    createElement('form', { ...props, className, noValidate: true, onSubmit: onSubmit, ref: form, children: [
      createElement(ContextProvider, { ...props, key: 'context', value: { registerFieldValidator, setFieldValue, getFieldValue, onSubmit, ...mergedAdditionalContext } }),
      error && createElement(ErrorMessage, { key: 'error', error }),
      createElement('input', { key: 'submit', type: 'submit', style: { visibility: 'hidden', position: 'absolute' } }),
    ] })
  )
}
