import { qs, onLoadContent } from '../helpers/helpers.js'

const __Dialog = () => {

  const onClick = e => {
    const triggerRef = e.target.closest('[data-dialog-target]')
    const dialogRef = document.querySelector(`dialog.Dialog${triggerRef?.dataset.dialogTarget}`)
    if (!(dialogRef && dialogRef)) return
    dialogRef.showModal()
  }

  qs.$?.addEventListener('click', onClick)
}


onLoadContent(__Dialog)