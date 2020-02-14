import { createElement } from 'react'

export const extractErrorMessage = error => error
  ? error.hasOwnProperty('stack')
    ? error.message || 'An error occurred'
    : error
  : 'An error occurred'

export default ({ error }) => createElement('div', {
  className: 'react-forms-error',
  children: extractErrorMessage(error)
})