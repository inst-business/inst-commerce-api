
const dialogBtns = document.querySelectorAll('button.Item__actions-delete')
Array.from(dialogBtns).map(btn => btn.onclick = e => {
  const target = e.target.dataset.dialogTarget,
        dialog = document.querySelector(target)
  if (!dialog) return
  const item = e.target.closest('.Item'),
        _id = e.target.dataset.formId,
        input = dialog.querySelector('input[name="ids[]"]'),
        title = item.querySelector('.Item__name').innerText,
        quote = /*html*/`You really want to delete <strong>${title}</strong> course?`,
        url = `/courses/i?_method=DELETE`
  input.value = _id
  dialog.querySelector('.Dialog__body').innerHTML = quote
  const form = dialog.querySelector('.Dialog__form')
  form.action = url
})