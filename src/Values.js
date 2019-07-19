export default props => {
  const { get, values } = props

  if(!get || typeof get !== 'function') throw new Error('You must provide a get function prop to the Value component')
  if(!values) throw new Error('The Value component must be a child of a Form component')
  
  return get(values)
}