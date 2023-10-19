import { qs } from '../helpers/helpers.js'

const pattern = 'input[type=checkbox]'
export const __Tabs = Array.from(qs.$a('[data-tab]'))
export const __TabsLabels = Array.from(qs.$a('[data-tab-target][tabindex]'))

__TabsLabels.map(tabLabel => tabLabel.addEventListener('click',
  function __activateTab () {
    const target = tabLabel.dataset.tabTarget
    const tab = qs.$o(`[data-tab]${target}`)
    const currentLabel = tab.querySelector(`[data-tab-target="${target}"][tabindex].active`) ||
      tab.querySelector(`[data-tab-target="${target}"][tabindex][aria-current="page"]`)
    currentLabel.removeAttribute('aria-current')
    currentLabel.classList.remove('active')
    tabLabel.setAttribute('aria-current', 'page')
  }
))

// __TabLabels.map(checkbox => checkbox.addEventListener('change',
//   function toggleSelectAll () {
//     const
//       target = checkbox.dataset.selectTarget,
//       selectAll = qs.$a(`${pattern}[data-select-all = ${target}]`),
//       checkboxLength = qs.$a(`${pattern}[data-select-target = ${target}]`).length,
//       checkedLength = qs.$a(`${pattern}[data-select-target = ${target}]:checked`).length
//     const isAllChecked = checkboxLength === checkedLength
//     Array.from(selectAll).map(checkall => checkall.checked = isAllChecked)
//   }
// ))