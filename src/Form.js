import React, { useState, useEffect } from 'react'
import { keyPath } from './keyPath'

export default ContextProvider => props => {
  const [validated, setValidated] = useState(false)
  const [values, setValues] = useState({})

  useEffect(() => props.values && setValues(props.values), [])

  const setValue = (name, value) => setValues(keyPath.set(name, { ...values }, value))
  const getValues = () => values
  const className = ((validated ? 'validated ' : '') + (props.className || '') || undefined)

  return (
    <form noValidate {...props} className={className}>
      <ContextProvider {...props} value={{ setValue, getValues, setValidated }} />
      <input type="submit" style={{ visibility: 'hidden', position: 'absolute' }}/>
    </form>
  )
}
