import React, { createContext, createElement } from 'react'
import FormProvider from './Form'
import submit from './submit'
import input from './input'

const context = createContext({})

const createConsumer = ConsumerComponent => props => (
  <context.Consumer>
    {context => createElement(ConsumerComponent, { ...context, ...props })}
  </context.Consumer>
)

export const Form = FormProvider(context.Provider)
export const Submit = createConsumer(submit(props => <button {...props} />))

export const Input = createConsumer(input(props => <input {...props} />))
export const Textarea = createConsumer(input(props => <textarea {...props} />))
export const Select = createConsumer(input(props =>
  <select {...props}>
    {props.options && props.options.map(x => <option value={x} key={x}>{x}</option> )}
    {props.children}
  </select>,
  { type: 'select' }
))

export const wrapInput = (component, options) => createConsumer(input(props => createElement(component, props), options))
export const wrapSubmit = component => createConsumer(submit(props => createElement(component, props)))
