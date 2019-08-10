import React, { Component } from 'react'
import { keyPath } from './keyPath'

export default render => class extends Component {
  state = { validated: false }

  constructor(props) {
    super(props)

    if(!props.name) throw new Error('You must provide a name prop to the Input component')
    if(!props.setValue) throw new Error('The Input component must be contained within a Form component')

    if(props.type === 'radio' ? props.checked : props.value) {
      props.setValue(props.name, props.value)
    }
  }

  handleChange = event => {
    const { name, type, value, numeric, setValue, onChange } = this.props

    if(name) {
      const elementValue = type === 'radio' ? value : event.target.value
      const finalValue = (type === 'number' || numeric) ? +elementValue : elementValue

      setValue(name, finalValue)
      event.target.checkValidity()
      this.setState({ validated: true })
    }

    if(onChange) {
      onChange(event)
    }
  }

  render() {
    const { setValue, setValidated, values, type, checked, ...propsToPass } = this.props
    const className = ((this.state.validated ? 'validated ' : '') + (this.props.className || '') || undefined)

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