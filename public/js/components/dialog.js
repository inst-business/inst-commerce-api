import qs from '../consts.js'

export const __DialogBtns = Array.from(qs.$a('[data-toggle = dialog]'))
export const __Dialogs = Array.from(qs.$a('dialog.Dialog'))

__DialogBtns.map(btn => btn.addEventListener('click', function toggleDialog () {
  const target = btn.dataset.dialogTarget
  const targetDialog = qs.$o(`dialog.Dialog${target}`)
  if (!targetDialog) {
    return
  }
  targetDialog.showModal()
}))