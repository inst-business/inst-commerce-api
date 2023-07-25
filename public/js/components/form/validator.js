import { isValidFnName, splitOutFnName, getFnValue } from '/config/handler.js'
import { $, $$ } from '/config/consts.js'


const validator = props => {
  const { form, rules, group, label, error, submit } = props
  const formElement = $(form)
  if (!formElement) return
  const inputNameRule = name => `[name="${name}"]:not([disabled])`

  const validateProps = (formElement, rule, error) => {
    const name = rule[0],
          field = formElement.querySelector(inputNameRule(name))
    if (!field) return false
    const type = field.type,
          rules = rule[1].split(' '),
          groupElement = field.parentElement.closest(group),
          comparisonField = formElement.querySelector(inputNameRule(rule?.[2])),
          errorElement = groupElement.querySelector(error)
    return {
      field, name, type, rules, errorElement,
      ...(comparisonField && {comparisonField})
    }
  }

  const validate = props => {
    const { field, name, type, rules, errorElement, comparisonField } = props
    const groupElement = field.parentElement.closest(group)
    let result

    for (let i = 0; i < rules.length; i++) {
      const fnName = isValidFnName(rules[i]) ? rules[i] : splitOutFnName(rules[i])
      const range = (fnName.length < rules[i].length) && getFnValue(rules[i])
      const comparison = (comparisonField) && {
        field: comparisonField,
        label: comparisonField.parentElement.closest(group).querySelector(label).innerText
      }
      const multiple = (['radio', 'checkbox'].includes(type)) && {
        type,
        fields: Array.from(groupElement.querySelectorAll(inputNameRule(name)))
      }
      let props = {
        val: field.value,
        label: groupElement.querySelector(label).innerText,
        ...(comparisonField && {comparison}),
        ...(range && {range}),
        ...(multiple && {multiple})
      }
      result = validator[fnName]?.(props)
      // console.log(result)
      if (result) break
    }

    if (result) {
      errorElement.innerText = result
      groupElement.classList.add('invalid')
    }
    else {
      errorElement.innerText = ''
      groupElement.classList.remove('invalid')
    }

    return !result
  }

  
  formElement.onsubmit = e => {
    e.preventDefault()
    let isFormValid = true
    rules.forEach(rule => {
      let props = validateProps(formElement, rule, error)
      if (!props) return
      let isValid = validate(props)
      isFormValid = isValid && isFormValid
    })

    if (isFormValid) {
      if (typeof submit === 'function') {
        let enableFields = formElement.querySelectorAll('[name]:not([disabled])')
        let fieldsVal = Array.from(enableFields).reduce((vals, field, index, array) => {
          switch (field.type) {
            case 'radio':
              if (field.checked) {
                vals[field.name] = field.value
              }
              break;
            case 'checkbox':
              if (field.checked) {
                vals[field.name] = !vals[field.name] ? [field.value] : [field.value, ...vals[field.name]]
              }
              break;
            default:
              vals[field.name] = !vals[field.name] && field.value
              break;
          }
          return vals
        }, {})
        submit(fieldsVal)
        // console.log(index, array.name)
      }
      else {
        formElement.submit()
      }
    }
  }

  rules.forEach(rule => {
    const props = validateProps(formElement, rule, error)
    if (!props) return
    // console.log(props)
    const { field, errorElement } = props
    field.onblur = () => {
      validate(props)
    }
    field.onchange = () => {
      validate(props)
    }
    field.oninput = () => {
      errorElement.innerText = ''
      field.parentElement.closest(group).classList.remove('invalid')
    }
  })
}

export default validator