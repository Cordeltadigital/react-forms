import React from 'react'
import { Input, Select, Textarea } from './index'

const base = (type, render) => ({ label, className, ...inputProps }) => (
  <div className={`${type} ${className}`}>
    <label>{label}</label>
    {render(inputProps)} />
  </div>
)

export const Text = base('Text', props => props.multiline ? <Textarea {...props} /> : <Input {...props} />)
export const Checkbox = base('Checkbox', props => <Input {...props} type="checkbox" />)
export const RadioButton = base('RadioButton', props => <Input {...props} type="radio" />)

export const Radio = base('Radio', ({ values, labels, ...props }) =>
  values.map((value, index) =>
    <RadioButton {...props} value={value} label={(labels && labels[index]) || value} />
  )
)

export const Select = base('Select', ({ values, labels, ...props }) =>
  <Select {...props}>
    {values.map((value, index) => <option value={value}>{(labels && labels[index]) || value}</option>)}
  </Select>
)

