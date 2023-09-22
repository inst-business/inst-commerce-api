
const dialogBtns = document.querySelectorAll('button.Item__actions-delete')
Array.from(dialogBtns).forEach(btn => btn.addEventListener('click', e => {
  const dialog = document.querySelector(btn.dataset.dialogTarget)
  if (!dialog) return
  const
    secretInputId = dialog.querySelector('input[name="id"]'),
    name = btn.closest('.Item').querySelector('.Item__name').innerText,
    contentElement = dialog.querySelector('.Dialog__body')
  secretInputId.value = btn.dataset.formId
  contentElement.innerHTML = /*html*/
    `You really want to delete <strong>${name}</strong> category?`
}))


const deleteDialog = document.querySelector('#delete-dialog')
const deleteForm = deleteDialog.querySelector('form.Dialog__form')
deleteForm?.addEventListener('submit', async (e) => {
  const closeBtn = deleteDialog.querySelector('[type="submit"][formmethod="dialog"]')
  if (e.submitter === closeBtn) return
  e.preventDefault()
  const inputId = deleteDialog.querySelector('input[name="id"]')
  const formData = { id: inputId.value }
  const deleteCategory = fetch('/v1/categories', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData),
  }).then(res => {
    deleteDialog.ariaBusy = true
    if (res.ok) {
      inputId.value = ''
      deleteDialog.removeAttribute('aria-busy')
      deleteDialog.close()
      window.location.reload()
    }
    return res.json()
  }).catch(e => console.error(e))
  await deleteCategory
})


const deleteSelectedBtn = document.querySelector('#delete-selected')
deleteSelectedBtn?.addEventListener('click', e => {
  const dialog = document.querySelector(deleteSelectedBtn.dataset.dialogTarget)
  if (!dialog) return
  const
    fields = document.querySelectorAll('input[name="id[]"][data-select-target="select-all"]:checked'),
    infoListElement = dialog.querySelector('.Dialog__body > ul'),
    idList = new Set()
  infoListElement.innerHTML = fields.length <= 0 ? '...' : ''
  for (const field of fields) {
    const name = field.closest('.Item').querySelector('.Item__name').innerText
    const listNode = document.createElement('li')
    listNode.appendChild(document.createTextNode(name))
    if (field.value != null) {
      idList.add(field.value)
      infoListElement.appendChild(listNode)
    }
  }

  const form = dialog.querySelector('form.Dialog__form')
  form.addEventListener('submit', async (e) => {
    const closeBtn = dialog.querySelector('[type="submit"][formmethod="dialog"]')
    if (e.submitter === closeBtn) return
    e.preventDefault()
    const formData = { id: Array.from(idList) }
    const deleteManyCategory = fetch('/v1/categories', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    }).then(res => {
      dialog.ariaBusy = true
      if (res.ok) {
        dialog.removeAttribute('aria-busy')
        dialog.close()
        window.location.reload()
      }
      return res.json()
    }).catch(e => console.error(e))
    console.log(await deleteManyCategory)
  })
})


const dialogImgToggle = document.querySelectorAll('.Item__img img')
Array.from(dialogImgToggle).forEach(img => img.addEventListener('click', e => {
  const dialog = document.querySelector(img.dataset.dialogTarget)
  if (!dialog) return
  dialog.querySelector('.Dialog__header').innerText = img.alt
  const dialogImg = dialog.querySelector('.Dialog__img')
  if (!dialogImg) return
  dialogImg.src = img.src
  dialogImg.alt = img.alt
  const closeBtn = dialog.querySelector('[formmethod="dialog"]')
  closeBtn?.addEventListener('click', e => {
    dialogImg.src = ''
    dialogImg.alt = ''
  })
}))