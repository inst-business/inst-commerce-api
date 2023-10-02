import { qs, isValidFnName, splitOutFnName, getFnValue } from '../../helpers/helpers.js'

const validator = props => {
  // console.log(props)
  const { form, rules, field, label, response } = props
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
          responseElement = fieldElement.querySelector(response),
          inputs = (['radio', 'checkbox'].includes(type)) && 
            Array.from(fieldElement.querySelectorAll(inputNameRule(name)))
    return {
      input, name, type, rules, fieldElement, responseElement,
      ...(inputs && {inputs}),
      ...(comparisonField && {comparisonField})
    }
  }

  const validate = props => {
    const {
      input, inputs,
      name, type, rules,
      fieldElement, responseElement, comparisonField
    } = props
    let result

    for (let i = 0; i < rules.length; i++) {
      const fnName = isValidFnName(rules[i]) ? rules[i] : splitOutFnName(rules[i])
      const range = (fnName.length < rules[i].length) && getFnValue(rules[i])
      const comparison = (comparisonField) && {
        input: comparisonField,
        label: comparisonField.parentElement.closest(field).querySelector(label).innerText
      }
      let props = {
        label: fieldElement.querySelector(label).innerText,
        val: input.value,
        ...(comparisonField && {comparison}),
        ...(range && {range}),
        ...(inputs && {inputs})
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

  const { submit, submitFormData } = props
  formElement.addEventListener('submit', function __ValidateFields (e) {
    e.preventDefault()
    let isFormValid = true
    rules.forEach(rule => {
      const props = validateProps(formElement, rule, response)
      if (!props) return
      const isValid = validate(props)
      isFormValid = isValid && isFormValid
    })
    if (isFormValid) {
      if (typeof submit !== 'function' && typeof submitFormData !== 'function') {
        formElement.submit()
        return
      }
      if (typeof submit === 'function') {
        const enableFields = formElement.querySelectorAll('[name]:not([disabled])')
        let data = Array.from(enableFields).reduce((vals, input, index, array) => {
          switch (input.type) {
            case 'radio': {
              if (input.checked) vals[input.name] = input.value
              break
            }
            case 'checkbox': {
              if (input.checked) (vals[input.name] = !vals[input.name])
                ? [input.value] : [input.value, ...vals[input.name]]
              break
            }
            case 'file': {
              vals[input.name] = !input.multiple ? input.files[0] : input.files
              break
            }
            default: {
              vals[input.name] = !vals[input.name] && input.value
              break
            }
          }
          return vals
        }, {})
        submit(data)
      }
      if (typeof submitFormData === 'function') {
        const formData = new FormData(formElement)
        // console.log('formData', Object.fromEntries(formData.entries()))
        submitFormData(formData)
      }
    }
  })

  rules.forEach(rule => {
    const props = validateProps(formElement, rule, response)
    if (!props) return
    // console.log(props)
    const { input, inputs, fieldElement, responseElement } = props
    const targets = inputs || [input]
    targets.forEach(target => {
      target.onblur = () => {
        validate(props)
      }
      target.onchange = () => {
        validate(props)
      }
      target.oninput = () => {
        fieldElement.classList.remove('invalid')
        fieldElement.removeAttribute('aria-invalid')
        if (responseElement) {
          responseElement.innerText = ''
        }
      }
    })
  })
}

export default validator