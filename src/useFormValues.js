import { useContext } from 'react'

export default context => function useFormValues() {
  return useContext(context).getFieldValues()
}