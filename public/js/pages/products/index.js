
const dialogBtns = document.querySelectorAll('button.Item__actions-delete')
Array.from(dialogBtns).map(btn => btn.addEventListener('click', e => {
  const target = btn.dataset.dialogTarget,
        dialog = document.querySelector(target)
  if (!dialog) return
  const item = btn.closest('.Item'),
        _id = btn.dataset.formId,
        input = dialog.querySelector('input[name="ids[]"]'),
        title = item.querySelector('.Item__name').innerText,
        quote = /*html*/`You really want to delete <strong>${title}</strong> product?`,
        url = `v1/products/i?_method=DELETE`
  input.value = _id
  console.log(item, title)
  dialog.querySelector('.Dialog__body').innerHTML = quote
  const form = dialog.querySelector('.Dialog__form')
  form.action = url
}))