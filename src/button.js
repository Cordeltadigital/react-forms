import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

export default (render, submit) => class extends Component {
  state = { executing: false }

  onButtonClick = e => this.executeHandler(e.target.closest('form'), e)

  componentDidMount() {
    if(submit) {
      const element = findDOMNode(this)
      if(element) {
        const form = element.closest('form')
        form.addEventListener('submit', e => this.executeHandler(form, e))
      }
    }
  }

  executeHandler = (form, e) => {
    const { onClick, onSubmit, values, setValidated } = this.props

    if(submit) {
      setValidated()
      if (form.checkValidity()) {
        const clickResponse = onSubmit && onSubmit(values)
        if (clickResponse instanceof Promise) {
          this.setState({ executing: true })
          clickResponse.finally(() => this.setState({ executing: false }))
        }
      }
    } else if(onClick) {
      onClick(values)
    }

    e.preventDefault()
  }

  render() {
    if(!this.props.values) throw new Error('Button components must be contained within a Form component')

    const { setValue, setValidated, onClick, values, children, ...propsToPass} = this.props
    const className = ((this.state.validated ? 'validated ' : '') + (this.props.className || '') || undefined)

    const finalProps = {
      ...propsToPass,
      children,
      className,
      onClick: this.onButtonClick,
      disabled: !!this.state.executing
    }

    return render(finalProps)
  }
}
