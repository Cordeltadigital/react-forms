import React, { Component } from 'react'

export default class extends Component {
  state = { validated: false }

  UNSAFE_componentWillMount = () => {
    if(!this.props.name) throw new Error('You must provide a name prop to the Select component')
    if(!this.props.setValue) throw new Error('You must consume the Select component through the form/index.js module')
    if(!this.props.options) throw new Error('You must provide an array of options to the Select component')

    this.props.setValue(this.props.name, this.props.initialValue || this.props.options[0])
  }

  handleChange = event => {
    this.props.setValue(this.props.name, event.target.value)
    event.target.checkValidity()
    this.setState({ validated: true })
    if(this.props.onChange) {
      this.props.onChange(event)
    }
  }

  render() {
    const { setValue, setValidated, values, ...propsToPass} = this.props
    const className = (this.state.validated ? 'validated ' : '') + this.props.className

    return <select
      {...propsToPass}
      className={className}
      onChange={this.handleChange} 
    >
      {this.props.options.map(x => (
        <option value={x} key={x}>{x}</option>
      ))}
    </select>
  }
}