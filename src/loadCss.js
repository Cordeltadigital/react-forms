const css = `

`

export default function loadCss() {
  if (typeof window !== 'undefined') {
    const style = window.document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(window.document.createTextNode(css));
    }
    window.document.appendChild(style)
  }
}