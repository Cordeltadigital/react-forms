import { createElement } from 'react'

export default ({ error }) => createElement('div', {
  className: 'react-forms-error',
  children: error ? error.message || error : undefined
})