import injectCss from './injectCss'

injectCss('react-forms-styles', `
.react-forms {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.react-forms-row {
  flex-direction: row;
  align-items: flex-start;
}

.react-forms-error {
  color: #f44336;
}
`)


