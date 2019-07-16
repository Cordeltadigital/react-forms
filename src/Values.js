export default props => {
  const { get, values } = props

  if(!get || typeof get !== 'function') throw new Error('You must provide a get function prop to the Value component')
  if(!values) throw new Error('You must consume the Value component through the form/index.js module')
  
  return get(values)
}