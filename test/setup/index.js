import enzyme from 'enzyme/build'

export const createSetup = render => (
  (props = undefined) => {
    const spy = jest.fn()
    const form = enzyme.mount(render({ props, spy }))

    const submit = (elementType = 'button') => form.find(elementType).simulate('click')
    const element = (type, name) => form.find(`${type}[name="${name}"]`)
    const change = (type, name, value) => {
      const elementToChange = element(type, name)
      elementToChange.instance().value = value
      elementToChange.simulate('change')
    }
    const click = (type, name, event) => element(type, name).simulate('click').simulate('change', event)
    const validateCalls = (...calls) => expect(spy.mock.calls).toEqual(calls.map(values => [values]))

    return { spy, form, submit, element, change, click, validateCalls }
  }
)

