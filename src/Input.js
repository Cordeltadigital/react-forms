import React, { Component } from 'react'
import { keyPath } from './keyPath'

export default class extends Component {
  state = { validated: false }

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
    if(!this.props.setValue) throw new Error('You must consume the Input component through the form/index.js module')

    const { setValue, setValidated, values, ...propsToPass} = this.props
    const className = (this.state.validated ? 'validated ' : '') + this.props.className

    return <input
      type="search"
      {...propsToPass}
      value={this.props.value || (this.props.name && keyPath(this.props.name, this.props.values)) || ''}
      className={className}
      onChange={this.handleChange} 
    />
  }
}