import React, { Component } from 'react'
import { keyPath } from './keyPath'

export default class extends Component {
  state = { validated: false }

  handleChange = event => {
    if(this.props.name) {
      this.props.setValue(this.props.name, event.target.value)
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
    
    return <input
      value={this.props.value || (this.props.name && keyPath(this.props.name, this.props.values)) || ''}
      type="search"
      {...propsToPass}
      className={this.state.validated ? 'validated' : ''}
      onChange={this.handleChange} 
    />
  }
}