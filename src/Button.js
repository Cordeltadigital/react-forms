import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import spinner from './spinner'

export default function createButtonComponent(submit) {
  return class extends Component {
    state = { executing: false }

    onButtonClick = e => this.executeHandler(e.target.closest('form'), e)

    executeHandler = (form, e) => {
      const { onClick, values, setValidated } = this.props

      if(submit) {
        setValidated()
        if (form.checkValidity()) {
          const clickResponse = onClick(values)
          if (clickResponse instanceof Promise) {
            this.setState({executing: true})
            clickResponse.finally(() => this.setState({executing: false}))
          }
        }
      } else {
        onClick(values)
      }

      e.preventDefault()
    }

    attachSubmitHandler = button => {
      if(submit) {
        const element = findDOMNode(button)
        if(element) {
          const form = element.closest('form')
          form.addEventListener('submit', e => this.executeHandler(form, e))
        }
      }
    }

    render() {
      if(!this.props.onClick || typeof this.props.onClick !== 'function') throw new Error('You must provide an onClick function prop to the Button component')
      if(!this.props.values) throw new Error('You must consume the Button component through the form/index.js module')

      const { setValue, setValidated, values, ...propsToPass} = this.props
      const className = (this.state.validated ? 'validated ' : '') + this.props.className

      return (
        <button
          {...propsToPass}
          className={className}
          onClick={this.onButtonClick}
          disabled={this.state.executing}
          ref={this.attachSubmitHandler}
        >
          {this.props.children}
          {this.state.executing && spinner}
        </button>
      )
    }
  }
}