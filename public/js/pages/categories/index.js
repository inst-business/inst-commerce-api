
const dialogBtns = document.querySelectorAll('button.Item__actions-delete')
Array.from(dialogBtns).map(btn => btn.addEventListener('click', e => {
  const dialog = document.querySelector(btn.dataset.dialogTarget)
  if (!dialog) return
  const
    form = dialog.querySelector('.Dialog__form'),
    input = dialog.querySelector('input[name="id[]"]'),
    name = btn.closest('.Item').querySelector('.Item__name').innerText,
    contentElement = dialog.querySelector('.Dialog__body'),
    closeBtn = dialog.querySelector('[type="submit"][formmethod="dialog"]')
  form.action = '/v1/categories?_method=DELETE'
  input.value = btn.dataset.formId
  contentElement.innerHTML = /*html*/
    `You really want to delete <strong>${name}</strong> product?`
  closeBtn.onclick = () => {
    form.action = ''
    input.value = ''
  }
}))


const dialogImgToggle = document.querySelectorAll('.Item__img img')
Array.from(dialogImgToggle).map(img => img.addEventListener('click', e => {
  const dialog = document.querySelector(img.dataset.dialogTarget)
  if (!dialog) return
  dialog.querySelector('.Dialog__header').innerText = img.alt
  const dialogImg = dialog.querySelector('.Dialog__img')
  dialogImg.src = img.src
  dialogImg.alt = img.alt
}))