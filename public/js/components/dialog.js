import { qs } from '../helpers/helpers.js'

export const __DialogBtns = Array.from(qs.$a('[data-dialog-target]'))
export const __Dialogs = Array.from(qs.$a('dialog.Dialog'))

__DialogBtns.map(btn => btn.addEventListener('click', function toggleDialog () {
  const target = btn.dataset.dialogTarget
  const dialog = qs.$o(`dialog.Dialog${target}`)
  if (!dialog) {
    return
  }
  dialog.showModal()
}))