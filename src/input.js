import React, { useState, useEffect } from 'react'
import types from './inputTypes'

const nextElementId = (id => () => `react-functional-forms-${++id}`)(0)

export default (render, options = {}) => function Input(props) {
  if (!props.name) throw new Error("You must provide a name prop to form components")
  if (!props.setFieldValue) throw new Error("Input components must be contained within a Form component")

  const [fieldValidated, setFieldValidated] = useState(false)
  const [error, setError] = useState(false)
  const [id] = useState(nextElementId())

  useEffect(() => {
    const { type, name, getFieldValue, setFieldValue, registerFieldValidator } = props
    const { setInitialValue, applyValueTransforms } = types(props, options)

    // don't override values that were set from passing a values prop to the form
    if(getFieldValue(name) === undefined) {
      setInitialValue({
        // pass a setter function - radio buttons do not always want to set a value!
        set: value => setFieldValue({ [name]: applyValueTransforms(value) }),
        element: document.querySelector(`#${id}`)
      })
    }
    registerFieldValidator(updateValidationState)

    // need to unregister in case of dynamic form elements
  }, [])

  const onChange = (...args) => {
    const [event] = args
    const { name, setFieldValue, onChange } = props
    const { valueFromEvent } = options
    const { getOutputValue, applyValueTransforms } = types(props, options)

    const elementValue = valueFromEvent
      ? valueFromEvent.apply(null, args)
      : getOutputValue({ event })

    setFieldValue({ [name]: applyValueTransforms(elementValue) })

    if(event.target.checkValidity) {
      event.target.checkValidity()
      updateValidationState()
    }

    if(onChange) {
      onChange.apply(event.target, args)
    }
  }

  const updateValidationState = () => {
    setFieldValidated(true)
    // this is a little hacky, but the simplest way I could think of to determine the
    // validity of the actual input element. :invalid is also not supported by enzyme
    setError(Boolean(document.querySelector(`#${id}:invalid`)))
  }

  /* render */ {
    const { passErrorProp } = options
    const { getValueProps } = types(props, options)

    const {
      type, name, value, checked, defaultValue, numeric,
      onSubmit, registerFieldValidator, setFieldValue, getFieldValue,
      ...passThroughProps
    } = props
    const valueProps = getValueProps({ currentValue: getFieldValue(name) })
    const errorProps = (passErrorProp && { error })
    const className = ((fieldValidated ? 'validated ' : '') + (props.className || '') || undefined)

    const finalProps = {
      id, type, name, className, onChange,
      ...passThroughProps, ...valueProps, ...errorProps
    }

    return render(finalProps)
  }
}