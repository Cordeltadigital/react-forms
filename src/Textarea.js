import React, { Component } from 'react'

export default class extends Component {
  state = { validated: false }

  handleChange = event => {
    this.props.setValue(this.props.name, event.target.value)
    event.target.checkValidity()
    this.setState({ validated: true })
  }

  render() {
    if(!this.props.name) throw new Error('You must provide a name prop to the Textarea component')
    if(!this.props.setValue) throw new Error('You must consume the Textarea component through the form/index.js module')
    
    return <textarea 
      name={this.props.name}
      required={this.props.required}
      className={'textarea' + (this.state.validated ? ' validated' : '')}
      onChange={this.handleChange} 
      data-focus={this.props.focus}
    />
  }
}