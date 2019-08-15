const resolveValue = (value, args) => typeof value === 'function' ? value.apply(null, args) : value

export default (props, options, type) => {
  const { checked, value, defaultValue } = props

  const checkboxValue = (checked, value) => (value === undefined
      ? Boolean(checked)
      : checked ? value : undefined
  )

  const applyValueTransforms = value => (props.type === 'number' || props.numeric) ? +value : value

  const types = {
    text: {
      setInitialValue: set => set((value || defaultValue)
        ? value || defaultValue
        : options.defaultValue && resolveValue(options.defaultValue, [props])
      ),
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
    },
    radio: {
      setInitialValue: set => checked && set(value),
      getOutputValue: () => value,
      getValueProps: ({ currentValue }) => ({ checked: applyValueTransforms(value) === currentValue })
    },
    checkbox: {
      setInitialValue: set => set(checkboxValue(checked, value)),
      getOutputValue: ({ event }) => checkboxValue(event.target.checked, value),
      getValueProps: ({ currentValue }) => ({ checked: Boolean(currentValue) })
    }
  }

  return { ...(types[type] || types.text), applyValueTransforms }
}
