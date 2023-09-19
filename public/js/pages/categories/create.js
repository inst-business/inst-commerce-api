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