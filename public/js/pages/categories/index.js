
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
        url = `/v1/categories?_method=DELETE`
  input.value = _id
  // console.log(item, title)
  dialog.querySelector('.Dialog__body').innerHTML = quote
  const form = dialog.querySelector('.Dialog__form')
  form.action = url
}))


const dialogImgToggle = document.querySelectorAll('.Item__img img')
Array.from(dialogImgToggle).map(img => img.addEventListener('click', e => {
  const target = img.dataset.dialogTarget
  const dialog = document.querySelector(target)
  if (!dialog) return
  dialog.querySelector('.Dialog__header').innerText = img.alt
  const dialogImg = dialog.querySelector('.Dialog__img')
  dialogImg.src = img.src
  dialogImg.alt = img.alt
}))