export default (target, delay = 200) => {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(
      () => target(...args),
      delay
    )
  }
}