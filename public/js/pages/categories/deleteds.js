
const dialogBtns = document.querySelectorAll('.Item__actions > button[data-action]')
Array.from(dialogBtns).map(btn => btn.onclick = e => {
  const dialog = document.querySelector(btn.dataset.dialogTarget)
  if (!dialog) return
  const
    form = dialog.querySelector('.Dialog__form'),
    input = dialog.querySelector('input[name="id[]"]'),
    name = btn.closest('.Item').querySelector('.Item__name').innerText,
    contentElement = dialog.querySelector('.Dialog__body'),
    action = btn.dataset.action,
    url = new URL(dialog.querySelector('#dialog-action').href),
    confirmBtn = dialog.querySelector('button.Dialog__confirm-button'),
    closeBtn = dialog.querySelector('[type="submit"][formmethod="dialog"]')
  switch (action) {
    case 'restore':
      url.searchParams.set('_method', 'PATCH')
      contentElement.innerHTML = /*html*/
        `Are you sure to restore <strong><em>${name}</em></strong>?<br>
        There must've been a problem that caused it to be deleted.`
      confirmBtn.dataset.variant = 'success'
      confirmBtn.innerText = 'Yes, restore this category'
      break;
    case 'destroy':
      url.searchParams.set('_method', 'DELETE')
      contentElement.innerHTML = /*html*/
        `You really want to <ins>permanently</ins> delete <strong><em>${name}</em></strong>?<br>
        You won't be able to restore this category anymore.`
      confirmBtn.dataset.variant = 'danger'
      confirmBtn.innerText = 'Permanently delete it!'
      break;
  }
  form.action = url
  input.value = btn.dataset.formId
  closeBtn.onclick = () => {
    confirmBtn.dataset.variant = ''
    form.action = ''
    input.value = ''
  }
})