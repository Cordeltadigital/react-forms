import React from 'react'
import { Input, Select, Textarea } from './index'

const base = render => ({ label, className, ...inputProps }) => (
  <div className={className}>
    <label>{label}</label>
    {render(inputProps)} />
  </div>
)

export const Text = base(props => props.multiline
  ? <Textarea {...props} />
  : <Input {...props} />
)

export const Checkbox = base(props => <Input {...props} type="checkbox" />)
export const RadioButton = base(props => <input {...props} type="radio" />)
export const Radio = base(({ options, groupProps }) => options.map(x =>
  <RadioButton {...groupProps} value={x} label={x} />
))
export const Select = base(props => <Select {...props} />)

