
const dialogBtns = document.querySelectorAll('button.appItem__actions-delete')
Array.from(dialogBtns).map(btn => btn.onclick = e => {
  const target = e.target.dataset.dialogTarget,
        dialog = document.querySelector(target)
  if (!dialog) return
  const item = e.target.closest('.appItem'),
        _id = e.target.dataset.formId,
        input = dialog.querySelector('input[name="ids[]"]'),
        title = item.querySelector('.appItem__name').innerText,
        quote = /*html*/`You really want to delete <strong>${title}</strong> course?`,
        url = `/courses/i?_method=DELETE`
  input.value = _id
  dialog.querySelector('.appDialog__body').innerHTML = quote
  const form = dialog.querySelector('.appDialog__form')
  form.action = url
})