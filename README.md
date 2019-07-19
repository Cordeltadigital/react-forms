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
    
    <Submit onClick={onSubmit}>Submit</Submit>
    <Button onClick={onCancel}>Cancel</Button>
  </Form>
)
```

`onSubmit` handler is passed an object containing form values, in this case:

```json
{
  "name": "",
  "description": "",
  "type": "One"
}
```

Simple dotted notation can be used to create deep object structures:

```jsx
<Form>
  <Input name="name" />
  <Input name="inventory.stockLevel" />
  <Input name="inventory.quantityOnOrder" />
  <Submit onClick={values => console.log(values)} />
</Form>
```

```json
{
  "name": "",
  "inventory": {
    "stockLevel": "",
    "quantityOnOrder": ""
  }
}
```

The `onClick` handler passed to the `Submit` component will also be triggered when the `enter` key is pressed while form 
elements are active.

If a promise is returned from the `onClick` handler, the button is disabled and a simple SVG spinner is displayed until
the promise resolves or rejects.