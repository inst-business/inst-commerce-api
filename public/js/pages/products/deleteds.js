
const dialogBtns = document.querySelectorAll('.Item__actions > button[data-action]')
Array.from(dialogBtns).map(btn => btn.onclick = e => {
  const target = btn.dataset.dialogTarget,
        action = btn.dataset.action,
        dialog = document.querySelector(target)
  if (!dialog) return
  const item = btn.closest('.Item'),
        _id = btn.dataset.formId,
        input = dialog.querySelector('input[name="ids[]"]'),
        name = item.querySelector('.Item__name').innerText,
        confirmBtn = dialog.querySelector('button.Dialog__confirm-button'),
        url = new URL(dialog.querySelector('#dialog-action').href)
  let quote = ''
  switch (action) {
    case 'restore':
      url.searchParams.set('_method', 'PATCH')
      quote = /*html*/`Are you sure to restore <strong>${name}</strong> product?<br>
        There must've been a problem that caused it to be deleted.`
      confirmBtn.classList.replace('btn-danger', 'btn-success')
      confirmBtn.innerText = 'Yes, restore this product'
      break;
    case 'destroy':
      url.searchParams.set('_method', 'DELETE')
      quote = /*html*/`You really want to <i>permanently</i> delete <strong>${name}</strong> product?<br>
        You won't be able to restore this product anymore.`
      confirmBtn.classList.replace('btn-success', 'btn-danger')
      confirmBtn.innerText = 'Permanently delete it!'
      break;
  }
  input.value = _id
  dialog.querySelector('.Dialog__body').innerHTML = quote
  const form = dialog.querySelector('.Dialog__form')
  form.action = url
})