import React, { useState, useEffect } from 'react'

export default render => props => {
  if (!props.name) throw new Error('You must provide a name prop to form components')
  if (!props.setFieldValue) throw new Error('Input components must be contained within a Form component')

  const [fieldValidated, setFieldValidated] = useState(false)

  useEffect(() => {
    const { type, checked, name, value, defaultValue, setFieldValue, registerFieldValidator } = props

    if (type === 'radio') {
      if (checked) {
        setFieldValue({ [name]: value })
      }
    } else if (value || defaultValue) {
      setFieldValue({ [name]: value || defaultValue })
    }

    registerFieldValidator(setFieldValidated)
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

    const finalValue = (type === 'number' || numeric) ? +elementValue : elementValue

    setFieldValue({ [name]: finalValue })

    if(event.target.checkValidity) {
      event.target.checkValidity()
      setFieldValidated(true)
    }

    if(onChange) {
      onChange.apply(event.target, args)
    }
  }

  const { type, name, value, checked, defaultValue, onSubmit, registerFieldValidator, setFieldValue, getFieldValue, ...propsToPass } = props
  const className = ((fieldValidated ? 'validated ' : '') + (props.className || '') || undefined)

  const currentValue = props.getFieldValue(name)
  const checkedProp = type === 'radio' && { checked: value === currentValue }
  const elementValue = type === 'radio' ? value : currentValue

  const finalProps = {
    ...propsToPass,
    ...checkedProp,
    value: elementValue || '',
    type,
    name,
    className,
    onChange
  }

  return render(finalProps)
}