import React, { Component } from 'react'
import { keyPath } from './keyPath'

export default class extends Component {
  state = { validated: false }

  constructor(props) {
    super(props)

    if(!props.name) throw new Error('You must provide a name prop to the Input component')
    if(!props.setValue) throw new Error('The Input component must be contained within a Form component')

    if(props.value) {
      props.setValue(props.name, props.value)
    }
  }

  handleChange = event => {
    if(this.props.name) {
      const value = this.props.type === 'number' ? +event.target.value : event.target.value
      this.props.setValue(this.props.name, value)
      event.target.checkValidity()
      this.setState({ validated: true })
    }

    if(this.props.onChange) {
      this.props.onChange(event)
    }
  }

  render() {
    const { setValue, setValidated, values, ...propsToPass} = this.props
    const className = ((this.state.validated ? 'validated ' : '') + (this.props.className || '') || undefined)
    const value = keyPath(this.props.name, this.props.values) || this.props.value || ''

    return <input
      type="search"
      {...propsToPass}
      value={value}
      className={className}
      onChange={this.handleChange} 
    />
  }
}