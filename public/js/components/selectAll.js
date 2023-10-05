import { qs } from '../helpers/helpers.js'

const pattern = 'input[type=checkbox]'
export const __Checkboxes = Array.from(qs.$a(`${pattern}[data-select-target]`))
export const __SelectAlls = Array.from(qs.$a(`${pattern}[data-select-all]`))

__SelectAlls.map(selectAll => selectAll.addEventListener('change',
  function __selectAllCheckbox () {
    const target = selectAll.dataset.selectAll
    const checkNodes = qs.$a(`${pattern}[data-select-target = ${target}]`)
    Array.from(checkNodes).map(checkbox => checkbox.checked = selectAll.checked)
  }
))

__Checkboxes.map(checkbox => checkbox.addEventListener('change',
  function __toggleSelectAll () {
    const
      target = checkbox.dataset.selectTarget,
      selectAll = qs.$a(`${pattern}[data-select-all = ${target}]`),
      checkboxLength = qs.$a(`${pattern}[data-select-target = ${target}]`).length,
      checkedLength = qs.$a(`${pattern}[data-select-target = ${target}]:checked`).length
    const isAllChecked = checkboxLength === checkedLength
    Array.from(selectAll).map(checkall => checkall.checked = isAllChecked)
  }
))