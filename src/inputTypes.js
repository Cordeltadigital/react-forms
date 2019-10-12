const resolveValue = (value, args) => typeof value === 'function' ? value.apply(null, args) : value

export default (props, options) => {
  const { type, checked, value, defaultValue } = props

  const applyValueTransforms = value => (props.type === 'number' || props.numeric) ? +value : value

  const defaultType = {
    setInitialValue: ({ set }) => {
      if(value !== undefined) {
        set(value)
      } else if (defaultValue !== undefined) {
        set(defaultValue)
      } else if (options.defaultValue !== undefined) {
        set(resolveValue(options.defaultValue, [props]))
      } else {
        set(undefined)
      }
    },
    getOutputValue: ({ event }) => {
      if (event.target && event.target.value !== undefined) {
        return event.target.value
      } else if (event.value !== undefined) {
        return event.value
      } else {
        throw new Error("Unable to determine input value from event")
      }
    },
    getValueProps: ({ currentValue }) => ({ value: currentValue || '' })
  }

  const checkboxValue = (checked, value) => (value === undefined
      ? Boolean(checked)
      : checked ? value : undefined
  )

  const types = {
    text: defaultType,
    radio: {
      setInitialValue: ({ set }) => checked && set(value),
      getOutputValue: () => value,
      getValueProps: ({ currentValue }) => ({ checked: applyValueTransforms(value) === currentValue })
    },
    checkbox: {
      setInitialValue: ({ set }) => set(checkboxValue(checked, value)),
      getOutputValue: ({ event }) => checkboxValue(event.target.checked, value),
      getValueProps: ({ currentValue }) => ({ checked: Boolean(currentValue) })
    },
    select: {
      ...defaultType,
      setInitialValue: ({ set, element }) => {
        set(value || defaultValue ||
          (props.options && props.options.length > 0 && props.options[0]) || // this probably should come out - is it the right behavior for all browsers? it's here to keep 1 unit test happy?
          element && element.value // this *should* work in all browsers (except jsdom)...
        )
      }
    }
  }

  return { ...(types[options.type || type] || types.text), applyValueTransforms }
}
