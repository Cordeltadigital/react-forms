import { useState, useEffect } from 'react'
import types from './inputTypes'

const nextElementId = (id => () => `react-functional-forms-${++id}`)(0)

export default (render, options = {}) => function Input(props) {
  if (!props.name) throw new Error("You must provide a name prop to form components")
  if (!props.setFieldValue) throw new Error("Input components must be contained within a Form component")

  const [fieldValidated, setFieldValidated] = useState(false)
  const [error, setError] = useState(false)
  const [id] = useState(props.id || nextElementId())

  useEffect(() => {
    const { name, getFieldValue, setFieldValue, registerFieldValidator } = props
    const { setInitialValue, applyValueTransforms } = types(props, options)

    // don't override values that were set from passing a values prop to the form
    if(getFieldValue(name) === undefined) {
      // TODO: change setter to a getter and return a private `UNSET` symbol to indicate not to call the field setter
      // this allows us to set the default value with useState above and not have an initial render cycle without the default value
      // BUT... to get the default value of a select list, we need to render it first? dilemma....

      setInitialValue({
        // pass a setter function - radio buttons do not always want to set a value!
        set: value => setFieldValue({ [name]: applyValueTransforms(value) }),
        element: document.querySelector(`#${id}`)
      })
    }
    registerFieldValidator(updateValidationState)

    // TODO: need to unregister in case of dynamic form elements
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

    if(event && event.target && event.target.checkValidity) {
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
    const typeProps = (type && { type })
    const errorProps = (passErrorProp && { error })
    const className = ((fieldValidated ? 'validated ' : '') + (props.className || '') || undefined)

    const finalProps = {
      id, name, className, onChange,
      ...passThroughProps, ...valueProps, ...typeProps, ...errorProps
    }

    return render(finalProps)
  }
}