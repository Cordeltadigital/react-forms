import { createContext, createElement } from 'react'
import FormProvider from './Form'
import submit from './submit'
import input from './input'

const context = createContext({})

const createConsumer = ConsumerComponent => props => createElement(
  context.Consumer,
  { children: context => createElement(ConsumerComponent, { ...context, ...props }) }
)

export const Form = FormProvider(context.Provider)
export const Submit = createConsumer(submit(props => createElement('button', props)))
export const Input = createConsumer(input(props => createElement('input', props)))
export const Textarea = createConsumer(input(props => createElement('textarea', props)))
export const Select = createConsumer(input(props => createElement('select', props), { type: 'select' }))

export const wrapInput = (component, options) => createConsumer(input(props => createElement(component, props), options))
export const wrapSubmit = component => createConsumer(submit(props => createElement(component, props)))

// export const Select = createConsumer(input(props =>
//   createElement('select', {
//     ...props,
//     children: [
//       props.options && props.options.map(x =>
//         createElement('option', { value: x, key: x, children: [x] })
//       ),
//       ...(props.children || [])
//     ]
//   }),
//   { type: 'select' }
// ))
