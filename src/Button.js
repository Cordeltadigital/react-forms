import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import spinner from './spinner'

export default function createButtonComponent(submit) {
  return class extends Component {
    state = { executing: false }

    onButtonClick = e => {
      this.executeHandler(e.target.closest('form'))
      e.preventDefault()
    }

    executeHandler = form => {
      const { onClick, values, setValidated } = this.props

      setValidated()
      if(form.checkValidity()) {
        const clickResponse = onClick(values)
        if(clickResponse instanceof Promise) {
          this.setState({ executing: true })
          clickResponse.finally(() => this.setState({ executing: false }))
        }
      }
    }

    attachSubmitHandler = button => {
      if(submit) {
        const element = findDOMNode(button)
        if(element) {
          const form = element.closest('form')
          form.addEventListener('submit', e => {
            this.executeHandler(form)
            e.preventDefault()
          })
        }
      }
    }

    render() {
      if(!this.props.onClick || typeof this.props.onClick !== 'function') throw new Error('You must provide an onClick function prop to the Button component')
      if(!this.props.values) throw new Error('You must consume the Button component through the form/index.js module')

      return (
        <button
          className={this.props.className} 
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