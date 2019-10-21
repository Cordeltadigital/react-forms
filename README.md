# @cordelta/react-forms

Ultra simple, stateless, validated forms for use in React function components.

## Installation

```shell
yarn add @cordelta/react-forms
```
    
## Usage

```jsx
import React from 'react'
import { Form, Input, Textarea, Select, Submit } from 'react-functional-forms'

export default ({ onSubmit, onCancel, initialValues }) => (
  <Form onSubmit={onSubmit} values={initialValues}>
    <label>Name</label>
    <Input name="name" required minLength="5" maxLength="50" />

    <label>Description</label>
    <Textarea name="description" maxLength="100" />

    <label>Type</label>
    <Select name="type" options={['', 'Widget', 'Component']} required />

    <label>Rating</label>
    <div>
      <Input name="rating" type="radio" numeric value="1" checked />
      <Input name="rating" type="radio" numeric value="2" />
      <Input name="rating" type="radio" numeric value="3" />
    </div>

    <label>Urgent</label>
    <Input name="urgent" type="checkbox" />

    <div>
      <Submit>Submit</Submit>
      <button onClick={onCancel}>Cancel</button>
    </div>
  </Form>
)
```

All `props` passed to components are passed to underlying HTML elements. Standard HTML `option` elements can also be
used for specifying options for the `Select` component. Using `type="number"` or adding a `numeric` prop will coerce 
the provided value to a `Number` type. Specifying a `value` prop for checkboxes causes the output value to toggle 
between the provided value and `undefined`.

Form `onSubmit` handlers are passed an object containing form values:

```json
{
  "name": "",
  "description": "",
  "type": "",
  "rating": 1,
  "urgent": false
}
```

The `onSubmit` handler passed to the `Form` component is only called if validation passes. Form submission is also 
triggered when the `Enter` key (or `Go` button on mobile) is pressed while form elements are active.

### Deep Object Structures

Simple dotted notation can be used to create deep object structures:

```jsx
<Form>
  <Input name="name" />
  <Input name="inventory.stockLevel" type="number" />
  <Input name="inventory.quantityOnOrder" type="number" />
  <Submit onSubmit={values => console.log(values)} />
</Form>
```

```json
{
  "name": "",
  "inventory": {
    "stockLevel": 0,
    "quantityOnOrder": 0
  }
}
```

### Styling

No styling is provided out of the box. Default corresponding HTML elements are used and can be directly styled using 
CSS or style attributes.

Additionally, a `validated` class is applied to individual elements as they change, and to the form when it is
submitted. This allows you to make use of the `:invalid` CSS pseudo-class, but only display validation styles after
validation has occurred.

Styling to work with the example code above might look something like:

```css
form > * {
  display: block;
}

form label {
  font-size: 0.8em;
}

form label:not(:first-child) {
  margin-top: 5px;
}

form .validated:invalid {
  outline: 1px solid red;
}
```

## Custom Components

`react-functional-forms` exposes functions that can be used to wrap components so that they can be included in output 
form value objects.

```jsx
import React from 'react'
import { wrapInput, wrapSubmit, Form } from 'react-functional-forms'

const InputField = wrapInput(({ label, className, ...inputProps }) =>
  <div className={className}>
    <label>{label}</label>
    <input {...inputProps} />
  </div>
)

const AnchorSubmit = wrapSubmit(props => <a {...props} />) 

export const SampleForm = ({ onSubmit }) => (
  <Form onSubmit={onSubmit}>
    <InputField label="Name" name="name" required />
    <InputField label="Description" name="description" maxLength="100" />
    <InputField label="Urgent" name="urgent" type="checkbox" />
    <AnchorSubmit>Submit</AnchorSubmit>
  </Form>
)
```

The `wrapInput` function manages the `value` and `onChange` props and in most cases, these are the only props you
need to pass to your input component. In the example above, all other props are also passed on to enable validation.

If your custom component is rendered with a `type` prop of `radio` or `checkbox`, this will cause the `checked` prop
to become managed instead of `value`, and should be passed to your input component. You can also force the component
to be treated as a radio button or checkbox by specifying options to the `wrapInput` function. More on this below.

The `wrapSubmit` function manages the `onClick` and `disabled` props of your submit component. All other props can be
safely ignored or passed on.

### Integration With Third Party Libraries

The functions described above can also be used to easily wrap components from third party libraries.

```jsx
import { wrapInput } from 'react-functional-forms'
import * as material from '@material-ui/core'

export const Input = wrapInput(material.Input)
export const Checkbox = wrapInput(material.Checkbox, { type: 'checkbox' })
export const Radio = wrapInput(material.Radio, { type: 'radio' })
export const Select = wrapInput(material.Select, { type: 'select' })
export const Switch = wrapInput(material.Switch, { type: 'checkbox' })
```

## API

### wrapInput(component, options)

Options are as follows:

Option|Type|Default|Description
-|-|-|-
type|string|'text'|One of `text`, `radio`, `checkbox` or `select`.
passErrorProp|boolean|false|Passes a boolean prop named `error` when field validation fails.
valueFromEvent|function||Override the default mechanism for retrieving a new field value from an onChange event. All function arguments are passed on.
defaultValue|any||Specify the default value for the field. Can be a value or a function that returns a value. 

### wrapSubmit(component)