import React, { Component } from 'react'
import {keyPath} from "./keyPath";

export default class extends Component {
  state = { validated: false }

  UNSAFE_componentWillMount = () => {
    if(!this.props.name) throw new Error('You must provide a name prop to the Textarea component')
    if(!this.props.setValue) throw new Error('The Input component must be contained within a Textarea component')

    if(this.props.value) {
      this.props.setValue(this.props.name, this.props.value)
    }
  }

  handleChange = event => {
    this.props.setValue(this.props.name, event.target.value)
    event.target.checkValidity()
    this.setState({ validated: true })
  }

  render() {
    const { setValue, setValidated, values, ...propsToPass} = this.props
    const className = ((this.state.validated ? 'validated ' : '') + (this.props.className || '') || undefined)
    const value = keyPath(this.props.name, this.props.values) || this.props.value || ''

    return <textarea
      {...propsToPass}
      value={value}
      className={className}
      onChange={this.handleChange} 
    />
  }
}