import React, { createContext, createElement } from 'react'
import FormProvider from './Form'
import button from './button'
import input from './input'

const context = createContext()

const createConsumer = ConsumerComponent => props => (
  <context.Consumer>
    {(context = {}) => createElement(ConsumerComponent, { ...context, ...props })}
  </context.Consumer>
)

export const Form = FormProvider(context.Provider)
export const Button = createConsumer(button(props => <button {...props} />, false))
export const Submit = createConsumer(button(props => <button {...props} />, true))

export const Input = props => createConsumer(input(props => <input {...props} />))(props)
export const Textarea = createConsumer(input(props => <textarea {...props} />))
export const Select = createConsumer(input(props =>
  <select {...props}>
    {props.options && props.options.map(x => <option value={x} key={x}>{x}</option> )}
    {props.children}
  </select>
))

export const wrapInput = component => createConsumer(input(props => createElement(component, props)))
export const wrapButton = component => createConsumer(button(props => createElement(component, props)))
