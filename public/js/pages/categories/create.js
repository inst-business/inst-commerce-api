const dialogImgToggle = document.querySelector('#preview-img')
dialogImgToggle?.addEventListener('click', e => {
  const dialog = document.querySelector(dialogImgToggle.dataset.dialogTarget)
  if (!dialog) return
  dialog.querySelector('.Dialog__header').innerText = img.alt
  const dialogImg = dialog.querySelector('.Dialog__img')
  if (!dialogImg) return
  dialogImg.src = dialogImgToggle.src
  dialogImg.alt = dialogImgToggle.alt
})

const form = document.querySelector('form#form-create')
form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const url = form.action
  const formData = new FormData(form)
  console.log('formData', Object.fromEntries(formData.entries()))
  const createCategory = fetch(url, {
    method: 'POST',
    body: formData,
  }).then(res => {
    if (res.ok) {
      window.location.replace('/v1/categories')
    }
    return res.json()
  }).catch(e => console.error(e))
  await createCategory
})