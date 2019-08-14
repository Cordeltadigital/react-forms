import React, { useState, useEffect } from 'react'

const nextId = (id => () => ++id)(0)
const elementId = id => `react-functional-forms-${id}`

export default (render, { passErrorProp } = {}) => props => {
  if (!props.name) throw new Error('You must provide a name prop to form components')
  if (!props.setFieldValue) throw new Error('Input components must be contained within a Form component')

  const [fieldValidated, setFieldValidated] = useState(false)
  const [error, setError] = useState(false)
  const [id] = useState(elementId(nextId()))

  const applyValueTransforms = value => (props.type === 'number' || props.numeric) ? +value : value

  const updateValidationState = () => {
    setFieldValidated(true)
    // this is a little hacky, but the simplest way I could think of to determine the
    // validity of the actual input element. :invalid is also not supported by enzyme
    setError(Boolean(document.querySelector(`#${id}:invalid`)))
  }

  useEffect(() => {
    const { type, checked, name, value, defaultValue, setFieldValue, registerFieldValidator } = props

    if (type === 'radio') {
      if (checked) {
        setFieldValue({ [name]: applyValueTransforms(value) })
      }
    } else if (value || defaultValue) {
      setFieldValue({ [name]: applyValueTransforms(value || defaultValue) })
    }

    registerFieldValidator(updateValidationState)
  }, [])

  const onChange = (...args) => {
    const [event, possibleArgumentValue] = args
    const { name, type, value, numeric, setFieldValue, onChange } = props

    const elementValue = (() => {
      if (type === 'radio') {
        return value
      } else if (event.target && event.target.value) {
        return event.target.value
      } else if (event.value) {
        return event.value
      } else {
        // the material-ui library passes the value as a second argument to the event handler
        return possibleArgumentValue
      }
    })()

    setFieldValue({ [name]: applyValueTransforms(elementValue) })

    if(event.target.checkValidity) {
      event.target.checkValidity()
      updateValidationState()
    }

    if(onChange) {
      onChange.apply(event.target, args)
    }
  }

  // remove any props that may interfere with rendering of the actual component
  const {
    type, name, value, checked, defaultValue, numeric,
    onSubmit, registerFieldValidator, setFieldValue, getFieldValue,
    ...passThroughProps
  } = props

  const className = ((fieldValidated ? 'validated ' : '') + (props.className || '') || undefined)

  // radio button handling
  const currentValue = props.getFieldValue(name)
  const elementValue = type === 'radio' ? value : currentValue
  const checkedProp = type === 'radio' && { checked: value === currentValue }
  const errorProp = passErrorProp && { error }

  const finalProps = {
    ...passThroughProps,
    ...checkedProp,
    ...errorProp,
    id,
    type,
    name,
    value: elementValue || '',
    className,
    onChange
  }

  return render(finalProps)
}