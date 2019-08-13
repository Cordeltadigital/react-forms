import React, { useState } from 'react'

export default render => props => {
  if(!props.onSubmit) throw new Error('Button components must be contained within a Form component')

  const [executing, setExecuting] = useState(false)

  const onClick = () => {
    const result = props.onSubmit()
    if(result && result.finally && typeof result.finally === 'function') {
      setExecuting(true)
      result.finally(() => setExecuting(false))
    }
  }

  const { onSubmit, registerFieldValidator, setFieldValue, getFieldValue, ...propsToPass } = props

  const finalProps = {
    ...propsToPass,
    onClick,
    disabled: executing
  }

  return render(finalProps)
}
