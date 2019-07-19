import React, { Component } from 'react'
import { keyPath } from './keyPath'

export default (ContextProvider) => class extends Component {
  constructor(props) {
    super(props)
    this.state = { values: props.values || {}, validated: false }
  }

  UNSAFE_componentWillReceiveProps({ values }) {
    this.setState({ values: values || this.state.values || {} })
  }

  // this is really a bit nasty - the following should say `keyPath.set(name, ...this.state.values, value)`
  // but unfortunately, this means the initial value is not passed to the submit handler
  // if this causes you issues, file an issue and give me a hard time haha
  setValue = (name, value) => this.setState({ values: keyPath.set(name, this.state.values, value) })
  setValidated = () => this.setState({ validated: true })

  render() {
    const className = ((this.state.validated ? 'validated ' : '') + (this.props.className || '') || undefined)

    return (
      <form noValidate {...this.props} className={className}>
        <ContextProvider {...this.props} value={{ 
          setValue: this.setValue, 
          values: this.state.values,
          setValidated: this.setValidated
        }} />
        <input type="submit" style={{ visibility: 'hidden', position: 'absolute' }}/>
      </form>
    )
  }
}