import validator from "./validator.js"

validator.required = props => {
  const { val, label, inputs } = props
  let condition = !inputs ? val.trim() : false

  if (inputs) {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        condition = true
        break
      }
    }
  }

  return !condition ? `${label || 'This field'} is required.` : undefined
}

validator.min = props => {
  const { val, label, range } = props
  return val.trim().length < range
    ? `${label || 'This field'} should be at least ${range} characters.` : undefined
}

validator.max = props => {
  const { val, label, range } = props
  return val.trim().length > range
    ? `${label || 'This field'} only requires up to ${range} characters.` : undefined
}

validator.email = props => {
  const { val, label } = props
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return !regex.test(val) ? `${label || 'This field'} must be an email.` : undefined
}

validator.password = props => {
  const { val, label } = props
  const lenghtRegex = /^.{8,16}$/
  if (!lenghtRegex.test(val)) {
    return `${label || 'This field'} must be 8 to 16 characters.`
  }

  const regexRules = [
    [/^.*(?=.*\d).*$/, '1 number'],
    [/^.*(?=.*[a-z]).*$/, '1 lowercase letter'],
    [/^.*(?=.*[A-Z]).*$/, '1 uppercase letter'],
    [/^.*(?=.*[@#$%^&*\-_+=\.]).*$/, '1 special character (@#$%^&*-_+=.)'],
  ]
  let invalid = []
  regexRules.forEach(regex => {
    if (!regex[0].test(val)) {
      invalid.push(regex[1])
    }
  })
  return invalid.length > 0
    ? `${label || 'This field'} must contains at least: ${invalid.join(', ')}.` : undefined
}

validator.confirmed = props => {
  const { val, label, comparison } = props
  const _label = comparison.label || label || 'This field'
  return (val !== comparison.input?.value) ? `${_label} does not match.` : undefined
}