import React, { useState } from 'react'

export default render => function Submit(props) {
  if(!props.onSubmit) throw new Error('Button components must be contained within a Form component')

  // TODO: set executing when form is triggered by enter key
  const [executing, setExecuting] = useState(false)

  const onClick = e => {
    const result = props.onSubmit(e)
    if(result && result.finally && typeof result.finally === 'function') {
      setExecuting(true)
      result.finally(() => setExecuting(false))
    }
  }

  const { onSubmit, registerFieldValidator, setFieldValue, getFieldValue, getFieldValues, ...propsToPass } = props

  const finalProps = {
    ...propsToPass,
    onClick,
    disabled: executing
  }

  return render(finalProps)
}
