
const dialogImgToggle = document.querySelector('#preview-img')
dialogImgToggle.addEventListener('click', e => {
  const dialog = document.querySelector(dialogImgToggle.dataset.dialogTarget)
  if (!dialog) return
  dialog.querySelector('.Dialog__header').innerText = img.alt
  const dialogImg = dialog.querySelector('.Dialog__img')
  if (!dialogImg) return
  dialogImg.src = dialogImgToggle.src
  dialogImg.alt = dialogImgToggle.alt
})

const form = document.querySelector('form#form-edit')
form?.addEventListener('reset', e => {
  const defaultSrc = dialogImgToggle.dataset.defaultSrc
  if (!defaultSrc) return
  dialogImgToggle.src = defaultSrc
})
form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const
    url = form.action,
    formData = new FormData(form),
    nameRef = form.querySelector('input[name="name"]'),
    imgRef = form.querySelector('input[name="img"][type="file"]')
  if (nameRef.defaultValue === nameRef.value) formData.delete(nameRef.name)
  if (imgRef.length <= 0 && imgRef.files[0] == null) formData.delete(imgRef.name)
  console.log('formData', Object.fromEntries(formData.entries()))
  const updateCategory = fetch(url, {
    method: 'PUT',
    body: formData,
  }).then(res => {
    if (res.ok) {
      window.location.replace('/categories')
    }
    return res.json()
  }).catch(e => console.error(e))
  await updateCategory
})