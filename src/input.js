import React, { useState, useEffect } from 'react'
import { keyPath } from './keyPath'

export default render => props => {
  const [fieldValidated, setFieldValidated] = useState(false)

  useEffect(() => {
    const { type, checked, name, value, defaultValue, setValue } = props

    if (!name) throw new Error('You must provide a name prop to form components')
    if (!setValue) throw new Error('Input components must be contained within a Form component')

    if (type === 'radio') {
      if (checked) {
        setValue(name, value)
      }
    } else if (value || defaultValue) {
      setValue(name, value || defaultValue)
    }
  }, [])

  const onChange = (...args) => {
    const [event, possibleArgumentValue] = args
    const { name, type, value, numeric, setValue, onChange } = props

    if(name) {
      const getElementValue = () => {
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
      }

      const finalValue = (type === 'number' || numeric) ? +getElementValue() : getElementValue()

      setValue(name, finalValue)
      if(event.target.checkValidity) {
        event.target.checkValidity()
        setFieldValidated(true)
      }
    }

    if(onChange) {
      onChange.apply(event.target, args)
    }
  }

  const { setValue, setValidated, getValues, type, checked, defaultValue, ...propsToPass } = props
  const className = ((fieldValidated ? 'validated ' : '') + (props.className || '') || undefined)

  // provide special handling for radio buttons
  const currentValue = keyPath(props.name, getValues())
  const formValue = currentValue || props.value || ''
  const elementValue = type === 'radio' ? props.value : formValue
  const checkedValue = type === 'radio' && { checked: String(elementValue) === String(currentValue) }

  const finalProps = {
    ...checkedValue,
    ...propsToPass,
    type,
    value: elementValue,
    className,
    onChange
  }

  return render(finalProps)
}