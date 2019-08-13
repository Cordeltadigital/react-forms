import React, { useState, useEffect } from 'react'
import { findDOMNode } from 'react-dom'

export default (render, submit) => props => {
  if(!props.getValues) throw new Error('Button components must be contained within a Form component')

  const [executing, setExecuting] = useState(false)

  useEffect(() => {
    if(submit) {
      const element = findDOMNode(this)
      if(element) {
        const form = element.closest('form')
        form.addEventListener('submit', e => executeHandler(form, e))
      }
    }
  }, [])

  const executeHandler = (form, e) => {
    const { onClick, onSubmit, getValues, setValidated } = props
    const values = getValues()

    if(submit) {
      setValidated(true)
      if (form.checkValidity()) {
        const clickResponse = onSubmit && onSubmit(values)
        if (clickResponse instanceof Promise) {
          setExecuting(true)
          clickResponse.finally(() => setExecuting(false))
        }
      }
    } else if(onClick) {
      onClick(values)
    }

    e.preventDefault()
  }

  const onButtonClick = e => executeHandler(e.target.closest('form'), e)

  const { setValue, setValidated, onClick, getValues, children, ...propsToPass} = props

  const finalProps = {
    ...propsToPass,
    children,
    onClick: onButtonClick,
    disabled: executing
  }

  return render(finalProps)
}
