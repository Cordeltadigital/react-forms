import { createElement, createRef, useReducer, useState } from 'react'
import { get, set } from 'object-path-immutable'

export default (ContextProvider, additionalContext = {}, ErrorMessage) => (
  ({ resetOnSubmit, row, gap, ...props }) => {
    const [fieldValues, setFieldValues] = useState(props.values || {})
    const [fieldValidators, registerFieldValidator] = useReducer((validators, validator) => [...validators, validator], [])
    const [error, setError] = useState()
    const form = createRef()

    const getFieldValue = path => get(fieldValues, path)
    const getFieldValues = () => fieldValues
    const mapFieldValues = target => Object.keys(target).reduce(
      (values, name) => set(values, name, target[name]),
      {}
    )

    const setFieldValue = (path, value) => setFieldValues(previousValues => set(previousValues, path, value))

    const onSubmit = (e, additionalValues) => {
      fieldValidators.forEach(setFieldValidated => setFieldValidated())

      if(form.current.checkValidity() && props.onSubmit) {
        setError(undefined)

        const interactiveElements = form.current.querySelectorAll('input,button,textarea,select')
        const setFormDisabled = disabled => interactiveElements.forEach(x => x.disabled = disabled)

        const reset = () => {
          if(resetOnSubmit) {
            setFieldValues(props.values || {})
          }
        }

        try {
          const checkResultForError = result => {
            if(result && (result.success === false || result.error)) {
              setError(result.error || result.message || 'Form submission failed')
            } else {
              reset()
            }
            setFormDisabled(false)
            return result
          }

          const result = props.onSubmit(mapFieldValues({ ...fieldValues, ...additionalValues }))
            if(result && typeof result.then === 'function') {
              setFormDisabled(true)
              result
                .then(checkResultForError)
                .catch(setError)
            } else {
              reset()
            }
        } catch(error) {
          setError(error)
        }
      }

      e && e.preventDefault && e.preventDefault()
    }

    const classNames = ['react-forms', props.className]
    if(row) {
      classNames.push('react-forms-row')
    }

    const mergedAdditionalContext = Object.keys(additionalContext).reduce(
      (result, property) => ({ ...result, [property]: props[property] || additionalContext[property] }),
      {}
    )

    return (
      createElement('form', {
        ...props,
        className: classNames.join(' '),
        noValidate: true,
        onSubmit: onSubmit,
        ref: form,
        ...(gap && { style: { gap } }),
        children: [
          createElement(ContextProvider, {
            ...props,
            key: 'context',
            value: {
              registerFieldValidator,
              setFieldValue,
              getFieldValue,
              getFieldValues,
              onSubmit,
              ...mergedAdditionalContext
            }
          }),
          error && createElement(ErrorMessage, { key: 'error', error }),
          createElement('input', {
            key: 'submit',
            type: 'submit',
            style: {
              visibility: 'hidden',
              position: 'absolute'
            }
          }),
        ]
      })
    )
  }
)