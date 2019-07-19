import React, { createContext, createElement } from 'react'
import FormProvider from './Form'
import InputConsumer from './Input'
import SelectConsumer from './Select'
import ButtonConsumer from './Button'
import TextareaConsumer from './Textarea'
import ValuesConsumer from './Values'

const context = createContext()

const createConsumer = ConsumerComponent => props => (
  <context.Consumer>
    {(context = {}) => createElement(ConsumerComponent, { ...context, ...props })}
  </context.Consumer>
)

export const Form = FormProvider(context.Provider)
export const Input = props => createConsumer(InputConsumer)(props)
export const Select = createConsumer(SelectConsumer)
export const Button = createConsumer(ButtonConsumer(false))
export const Submit = createConsumer(ButtonConsumer(true))
export const Textarea = createConsumer(TextareaConsumer)
export const Values = createConsumer(ValuesConsumer)