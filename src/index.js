import React, { createContext, createElement } from 'react'
import FormProvider from './Form'
import ButtonConsumer from './Button'
import wrapRender from './wrap'

const context = createContext()

const createConsumer = ConsumerComponent => props => (
  <context.Consumer>
    {(context = {}) => createElement(ConsumerComponent, { ...context, ...props })}
  </context.Consumer>
)

export const Form = FormProvider(context.Provider)
export const Button = createConsumer(ButtonConsumer(false))
export const Submit = createConsumer(ButtonConsumer(true))

export const Input = props => createConsumer(wrapRender(props => <input {...props} />))(props)
export const Textarea = createConsumer(wrapRender(props => <textarea {...props} />))
export const Select = createConsumer(wrapRender(props =>
  <select {...props}>
    {props.options.map(x => <option value={x} key={x}>{x}</option> )}
  </select>
))

export const wrap = component => createConsumer(wrapRender(props => createElement(component, props)))