import React, { Component } from 'react'
import { keyPath } from './keyPath'

export default render => class extends Component {
  state = { validated: false }

  constructor(props) {
    super(props)

    if(!props.name) throw new Error('You must provide a name prop to form components')
    if(!props.setValue) throw new Error('Input components must be contained within a Form component')

    if(props.type === 'radio') {
      if(props.checked) {
        props.setValue(props.name, props.value)
      }
    } else if (props.value || props.defaultValue) {
      props.setValue(props.name, props.value || props.defaultValue)
    }
  }

  handleChange = (...args) => {
    const [event, possibleArgumentValue] = args
    const { name, type, value, numeric, setValue, onChange } = this.props

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
        this.setState({ validated: true })
      }
    }

    if(onChange) {
      onChange.apply(event.target, args)
    }
  }

  render() {
    const { setValue, setValidated, values, type, checked, defaultValue, ...propsToPass } = this.props
    const className = ((this.state.validated ? 'validated ' : '') + (this.props.className || '') || undefined)

    // provide special handling for radio buttons
    const currentValue = keyPath(this.props.name, this.props.values)
    const formValue = currentValue || this.props.value || ''
    const elementValue = type === 'radio' ? this.props.value : formValue
    const checkedValue = type === 'radio' && { checked: String(elementValue) === String(currentValue) }

    const finalProps = {
      ...checkedValue,
      ...propsToPass,
      type,
      value: elementValue,
      className,
      onChange: this.handleChange
    }

    return render(finalProps)
  }
}