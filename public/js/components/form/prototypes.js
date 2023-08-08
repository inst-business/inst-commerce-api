import validator from "./validator.js"

validator.required = props => {
  const { val, label, multiple } = props
  const _label = label || 'This field'
  let condition = !multiple ? val.trim() : false

  if (multiple && ['radio', 'checkbox'].includes(multiple?.type)) {
    // console.log(multiple)
    for (let i = 0; i < multiple?.inputs.length; i++) {
      if (multiple.inputs[i].checked) {
        condition = true
        break
      }
    }
  }

  return condition ? undefined : `${_label} is required.`
}

validator.min = props => {
  const { val, label, range } = props
  const _label = label || 'This field'
  return val.trim().length >= range ? undefined : `${_label} should be at least ${range} characters.`
}

validator.max = props => {
  const { val, label, range } = props
  const _label = label || 'This field'
  return val.trim().length <= range ? undefined : `${_label} only requires up to ${range} characters.`
}

validator.email = props => {
  const { val, label } = props
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const _label = label || 'This field'
  return regex.test(val) ? undefined : `${_label} must be an email.`
}

validator.password = props => {
  const { val, label } = props
  const lenghtRegex = /^.{8,16}$/
  if (!lenghtRegex.test(val)) {
    return 'Password must be 8 to 16 characters.'
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
  return !invalid.length ? undefined : `Password must contains at least: ${invalid.join(', ')}.`
}

validator.confirmed = props => {
  const { val, label, comparison } = props
  const _label = comparison.label || label || 'This field'
  return val === comparison.field.value ? undefined : `${_label} does not match.`
}