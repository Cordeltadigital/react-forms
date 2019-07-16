import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import Spinner from './spinner'

export default function createButtonComponent(submit) {
  return class extends Component {
    state = { executing: false }

    onButtonClick = e => this.executeHandler(e.target.closest('form'))

    executeHandler = form => {
      const { onClick, values, setValidated } = this.props

      setValidated()
      if(form.checkValidity()) {
        const clickResponse = onClick(values)
        if(clickResponse instanceof Promise) {
          this.setState({ executing: true })
          clickResponse
            .then(() => this.setState({ executing: false }))
            .catch(error => {
              this.setState({ executing: false })
              throw error
            })
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
          {this.state.executing && <Spinner />}
        </button>
      )
    }
  }
}