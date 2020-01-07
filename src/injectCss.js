export default function injectCss(id, css) {
  if (!css || typeof document === 'undefined' || document.querySelector(`#${id}`)) return

  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.id = id
  style.type = 'text/css'

  head.appendChild(style)

  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}