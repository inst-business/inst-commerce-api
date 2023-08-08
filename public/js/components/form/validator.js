import { qs, isValidFnName, splitOutFnName, getFnValue } from '../../helpers/helpers.js'

const validator = props => {
  // console.log(props)
  const { form, rules, field, label, response, submit } = props
  const formElement = qs.$o(form)
  if (!formElement) return
  const inputNameRule = name => `[name="${name}"]:not([disabled])`

  const validateProps = (formElement, rule, response) => {
    const name = rule[0],
          input = formElement.querySelector(inputNameRule(name))
    if (!input) return false
    const type = input.type,
          rules = rule[1].split(' '),
          fieldElement = input.parentElement.closest(field),
          comparisonField = formElement.querySelector(inputNameRule(rule?.[2])),
          responseElement = fieldElement.querySelector(response)
    return {
      input, name, type, rules, fieldElement, responseElement,
      ...(comparisonField && {comparisonField})
    }
  }

  const validate = props => {
    const {
      input, name, type, rules, fieldElement, responseElement, comparisonField
    } = props
    let result

    for (let i = 0; i < rules.length; i++) {
      const fnName = isValidFnName(rules[i]) ? rules[i] : splitOutFnName(rules[i])
      const range = (fnName.length < rules[i].length) && getFnValue(rules[i])
      const comparison = (comparisonField) && {
        input: comparisonField,
        label: comparisonField.parentElement.closest(field).querySelector(label).innerText
      }
      const multiple = (['radio', 'checkbox'].includes(type)) && {
        type,
        inputs: Array.from(fieldElement.querySelectorAll(inputNameRule(name)))
      }
      let props = {
        val: input.value,
        label: fieldElement.querySelector(label).innerText,
        ...(comparisonField && {comparison}),
        ...(range && {range}),
        ...(multiple && {multiple})
      }
      result = validator[fnName]?.(props)
      // console.log(result)
      if (result) break
    }

    if (result) {
      fieldElement.classList.add('invalid')
      fieldElement.setAttribute('aria-invalid', true)
    }
    else {
      fieldElement.classList.remove('invalid')
      fieldElement.removeAttribute('aria-invalid')
    }
    if (responseElement) {
      responseElement.innerText = result || ''
    }

    return !result
  }

  
  formElement.onsubmit = e => {
    e.preventDefault()
    let isFormValid = true
    rules.forEach(rule => {
      let props = validateProps(formElement, rule, response)
      if (!props) return
      let isValid = validate(props)
      isFormValid = isValid && isFormValid
    })

    if (isFormValid) {
      if (typeof submit === 'function') {
        let enableFields = formElement.querySelectorAll('[name]:not([disabled])')
        let inputsVal = Array.from(enableFields).reduce((vals, input, index, array) => {
          switch (input.type) {
            case 'radio':
              if (input.checked) {
                vals[input.name] = input.value
              }
              break;
            case 'checkbox':
              if (input.checked) {
                vals[input.name] = !vals[input.name] ? [input.value] : [input.value, ...vals[input.name]]
              }
              break;
            default:
              vals[input.name] = !vals[input.name] && input.value
              break;
          }
          return vals
        }, {})
        submit(inputsVal)
      }
      else {
        formElement.submit()
      }
    }
  }

  rules.forEach(rule => {
    const props = validateProps(formElement, rule, response)
    if (!props) return
    console.log(props)
    console.log(document.querySelectorAll('#aaa'))
    const { input, fieldElement, responseElement } = props
    input.onblur = () => {
      validate(props)
    }
    input.onchange = () => {
      validate(props)
    }
    input.oninput = () => {
      fieldElement.classList.remove('invalid')
      fieldElement.removeAttribute('aria-invalid')
      if (responseElement) {
        responseElement.innerText = ''
      }
    }
  })
}

export default validator