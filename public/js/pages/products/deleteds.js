
const dialogBtns = document.querySelectorAll('.action-buttons > button[data-action]')
Array.from(dialogBtns).map(btn => btn.onclick = e => {
  const target = e.target.dataset.dialogTarget,
        action = e.target.dataset.action,
        dialog = document.querySelector(target)
  if (!dialog) return
  const item = e.target.closest('.product-item'),
        _id = e.target.dataset.formId,
        input = dialog.querySelector('input[name="ids[]"]'),
        name = item.querySelector('.product-item__name').innerText,
        confirmBtn = dialog.querySelector('button.dialog__confirm-button'),
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
  dialog.querySelector('.dialog__body').innerHTML = quote
  const form = dialog.querySelector('.dialog__form')
  form.action = url
})