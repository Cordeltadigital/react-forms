import React, { useState, useEffect } from 'react'

const nextId = (id => () => ++id)(0)
const elementId = id => `react-functional-forms-${id}`

// this module is getting a little long and unwieldy, but it's still reasonably clear and I'm not sure of the best
// way to refactor. Specific radio button handling adds some complexity, could split that stuff out
export default (render, options = {}) => props => {
  if (!props.name) throw new Error('You must provide a name prop to form components')
  if (!props.setFieldValue) throw new Error('Input components must be contained within a Form component')

  const [fieldValidated, setFieldValidated] = useState(false)
  const [error, setError] = useState(false)
  const [id] = useState(elementId(nextId()))

  const applyValueTransforms = value => (props.type === 'number' || props.numeric) ? +value : value
  const resolveValue = (value, args) => typeof value === 'function' ? value.apply(null, args) : value
  const defaultValueFromOptions = () => options.defaultValue && resolveValue(options.defaultValue, [props])

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

    } else if (options.defaultValue) {
      setFieldValue({ [name]: defaultValueFromOptions() })
    }

    registerFieldValidator(updateValidationState)
  }, [])

  const onChange = (...args) => {
    const [event] = args
    const { name, type, value, setFieldValue, onChange } = props
    const { valueFromEvent } = options

    const elementValue = (() => {
      if(valueFromEvent) {
        return valueFromEvent.apply(null, args)
      } else if (type === 'radio') {
        return value
      } else if (event.target && event.target.value !== undefined) {
        return event.target.value
      } else if (event.value !== undefined) {
        return event.value
      } else {
        throw new Error('Unable to determine input value from event')
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

  // introducing a block here prevents any declarations here from clobbering declarations above
  // this is a serious code smell that the module is getting too long and violates SRP
  {
    // remove any props that may interfere with rendering of the actual component
    const {
      type, name, value, checked, defaultValue, numeric,
      onSubmit, registerFieldValidator, setFieldValue, getFieldValue,
      ...passThroughProps
    } = props
    const { passErrorProp } = options

    const className = ((fieldValidated ? 'validated ' : '') + (props.className || '') || undefined)

    // radio button handling
    const currentValue = props.getFieldValue(name)
    const elementValue = type === 'radio' ? value : currentValue
    const finalValue = elementValue === undefined ? (defaultValueFromOptions() || '') : elementValue

    const checkedProp = type === 'radio' && { checked: value === currentValue }
    const errorProp = passErrorProp && { error }

    const finalProps = {
      ...passThroughProps,
      ...checkedProp,
      ...errorProp,
      id,
      type,
      name,
      value: finalValue,
      className,
      onChange
    }

    return render(finalProps)
  }
}