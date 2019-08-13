# react-functional-forms

Build ultra simple, stateless, validated forms for use in React function components.

## Installation

    yarn add react-functional-forms
    
## Usage

```jsx
import { Form, Input, Textarea, Select, Button, Submit } from 'react-functional-forms'

export default ({ onSubmit, onCancel }) => (
  <Form>
    <label>Name</label>
    <Input name="name" required minlength="5" maxlength="50" />

    <label>Description</label>
    <Textarea name="description" maxlength="100" />

    <label>Type</label>
    <Select name="type" options={['One', 'Two']}>

    <label>Rating</label>
    <div>
      <Input name="rating" type="radio">1</Input>
      <Input name="rating" type="radio">2</Input>
      <Input name="rating" type="radio">3</Input>
    </div>
    
    <Submit onSubmit={onSubmit}>Submit</Submit>
    <Button onClick={onCancel}>Cancel</Button>
  </Form>
)
```

All `props` passed to components are passed to underlying HTML elements.

### Submit Semantics

The Submit `onSubmit` and Button `onClick` handlers are passed an object containing form values:

```json
{
  "name": "",
  "description": "",
  "type": "One"
}
```

The `onSubmit` handler passed to the `Submit` component is only called if validation passes. The `onClick` handler
passed to `Button` components does not trigger validation and is passed unvalidated values. 

The `onSubmit` handler will also be triggered when the `enter` key is pressed while form elements are active.

### Deep Object Structures

Simple dotted notation can be used to create deep object structures, and using `type="number"` or adding a `numeric` 
prop will coerce the provided value to a Number type:

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

/* style all invalid elements when the form is submitted */
form.validated *:invalid, 
/* style individual invalid elements as they change */
form *.validated:invalid {
  border: 2px solid red;
}
```

### Custom Components

`react-functional-forms` exposes a `wrap` function that can be used to wrap components so that they can be included in 
output form value objects.

```jsx harmony
import React from 'react'
import { wrap, Form, Submit } from 'react-functional-forms'

const InputField = wrap(({ onChange, name, label, required, className }) =>
  <div className={className}>
    <label>{label}</label>
    <input name={name} onChange={onChange} required={required} />
  </div>
)

export const SampleForm = ({ onSubmit }) => (
  <Form>
    <InputField label="Name" name="name" required />
    <InputField label="Description" name="description" />
    <Submit onSubmit={onSubmit} />
  </Form>
)
```

### Integration With Third Party Libraries

The `wrap` function described above can also be used to wrap components from third party libraries. 

```jsx harmony

```