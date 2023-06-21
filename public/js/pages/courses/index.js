
const dialogBtns = document.querySelectorAll('button.delete-course')
Array.from(dialogBtns).map(btn => btn.onclick = e => {
  const target = e.target.dataset.dialogTarget,
        dialog = document.querySelector(target)
  if (!dialog) return
  const item = e.target.closest('.course-item'),
        _id = e.target.dataset.formId,
        input = dialog.querySelector('input[name="ids[]"]'),
        title = item.querySelector('.course-item__title').innerText,
        quote = /*html*/`You really want to delete <strong>${title}</strong> course?`,
        url = `/courses/i?_method=DELETE`
  input.value = _id
  dialog.querySelector('.dialog__body').innerHTML = quote
  const form = dialog.querySelector('.dialog__form')
  form.action = url
})