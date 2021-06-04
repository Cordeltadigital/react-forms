import { useState, useEffect } from 'react'
import usePrevious from './usePrevious'
import useUpdate from './useUpdate'
import types from './inputTypes'
import createThrottled from './throttle'

const nextElementId = (id => () => `react-forms-${++id}`)(0)

export default (render, options = {}) => function Input(props) {
  if (!props.name) throw new Error("You must provide a name prop to form components")
  if (!props.setFieldValue) throw new Error("Input components must be contained within a Form component")

  const [fieldValidated, setFieldValidated] = useState(false)
  const [error, setError] = useState(false)
  const [id] = useState(props.id || nextElementId())
  const previousValueProp = usePrevious(props.value)

  // this is currently broken :-\
  const {  throttle, onSubmit } = props
  const submitHandler = (throttle && onSubmit) ? createThrottled(onSubmit, isNaN(throttle) ? 200 : throttle) : onSubmit

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
        set: value => setFieldValue(name, applyValueTransforms(value)),
        element: document.querySelector(`#${id}`)
      })
    }
    registerFieldValidator(updateValidationState)

    // TODO: need to unregister in case of dynamic form elements
  }, [])

  // ensure form values are updated to reflect passed `value` prop
  // this probably introduces some redundancy with the onChange handler below
  useUpdate(() => {
    const { name, value, setFieldValue } = props
    const { applyValueTransforms } = types(props, options)

    if(value !== previousValueProp) {
      setFieldValue(name, applyValueTransforms(value))
    }
  }, [props])

  const onChange = (...args) => {
    const [event] = args
    const { name, setFieldValue, onChange, submitOnChange } = props
    const { valueFromEvent } = options
    const { getOutputValue, applyValueTransforms } = types(props, options)

    const elementValue = valueFromEvent
      ? valueFromEvent.apply(null, args)
      : getOutputValue({ event })

    setFieldValue(name, applyValueTransforms(elementValue))

    if(event && event.target && event.target.checkValidity) {
      event.target.checkValidity()
      updateValidationState()
    }

    if(onChange) {
      onChange.apply(event.target, args)
    }

    if(submitOnChange && submitHandler) {
      // the setFieldValue above sets state on the Form component, used in the onSubmit handler
      // setting state requires an additional render cycle - we need to pass in the new value so it's set correctly
      submitHandler(undefined, { [name]: applyValueTransforms(elementValue) })
    }
  }

  const onBlur = (...args) => {
    const { submitOnBlur, onSubmit, onBlur } = props
    const [event] = args

    if(submitOnBlur) {
      onSubmit()
    }
    if(onBlur) {
      onBlur.apply(event.target, args)
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
      submitOnChange, submitOnBlur, throttle,
      ...passThroughProps
    } = props
    const valueProps = getValueProps({ currentValue: getFieldValue(name) })
    const typeProps = (type && { type })
    const errorProps = (passErrorProp && { error })
    const className = ((fieldValidated ? 'validated ' : '') + (props.className || '') || undefined)

    const finalProps = {
      id, name, className,
      ...passThroughProps, ...valueProps, ...typeProps, ...errorProps,
      onChange, onBlur
    }

    return render(finalProps)
  }
}