
const dialogBtns = document.querySelectorAll('.Item__actions > button[data-action]')
Array.from(dialogBtns).forEach(btn => 
  btn.addEventListener('click', printInfomation = e => {
    const dialog = document.querySelector(btn.dataset.dialogTarget)
    if (!dialog) return
    const
      action = btn.dataset.action,
      secretInputId = dialog.querySelector('input[name="id"]'),
      name = btn.closest('.Item').querySelector('.Item__name').innerText,
      contentElement = dialog.querySelector('.Dialog__body'),
      confirmBtn = dialog.querySelector('[type="submit"]:not([formmethod="dialog"])')
    secretInputId.value = btn.dataset.formId
    secretInputId.dataset.action = action
    switch (action) {
      case 'restore': {
        contentElement.innerHTML = /*html*/
          `Are you sure to restore <strong><em>${name}</em></strong>?<br>
          There must've been a problem that caused it to be deleted.`
        confirmBtn.dataset.variant = 'success'
        confirmBtn.innerText = 'Yes, restore this category'
        break
      }
      case 'destroy': {
        contentElement.innerHTML = /*html*/
          `You really want to <ins>permanently</ins> delete <strong><em>${name}</em></strong>?<br>
          You won't be able to restore this category anymore.`
        confirmBtn.dataset.variant = 'danger'
        confirmBtn.innerText = 'Permanently delete it'
        break
      }
    }
  })
)


const actionsDialog = document.querySelector('#actions-dialog')
const actionsForm = actionsDialog.querySelector('form.Dialog__form')
actionsForm?.addEventListener('submit', performAction = async (e) => {
  const closeBtn = actionsDialog.querySelector('[type="submit"][formmethod="dialog"]')
  if (e.submitter === closeBtn) return
  e.preventDefault()
  actionsDialog.ariaBusy = true
  const inputId = actionsDialog.querySelector('[name="id"]')
  const action = inputId.dataset.action
  if (!['restore', 'destroy'].includes(action)) return
  const
    method = action === 'destroy' ? 'DELETE' : 'PATCH',
    formData = { id: inputId.value },
    performAction = fetch('/v1/categories/d', {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) {
          inputId.value = ''
          actionsDialog.close()
          window.location.reload()
        }
        return res.json()
      })
      .catch(e => console.error(e))
      .finally(() => { actionsDialog.removeAttribute('aria-busy') })
  await performAction
})


const restoreSelectedBtn = document.querySelector('#restore-selected')
const destroySelectedBtn = document.querySelector('#destroy-selected')
Array.from([restoreSelectedBtn, destroySelectedBtn]).forEach(btn =>
  btn.addEventListener('click', printInfomation = e => {
    const dialog = document.querySelector(restoreSelectedBtn.dataset.dialogTarget)
    if (!dialog) return
    const
      fields = document.querySelectorAll('[name="id[]"][data-select-target="select-all"]:checked'),
      secretInputIds = dialog.querySelector('[name="ids"]'),
      contentElement = dialog.querySelector('.Dialog__body > p'),
      infoListElement = dialog.querySelector('.Dialog__body > ul'),
      confirmBtn = dialog.querySelector('[type="submit"]:not([formmethod="dialog"])'),
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
    secretInputIds.value = JSON.stringify(Array.from(idList))
    if (btn === restoreSelectedBtn) {
      secretInputIds.dataset.action = 'restore'
      contentElement.innerHTML = /*html*/
        `They seem to have been removed for some reason.
        <br>Are you sure to restore these following categories?`
      confirmBtn.dataset.variant = 'success'
      confirmBtn.innerText = 'Yes, restore them'
    }
    if (btn === destroySelectedBtn) {
      secretInputIds.dataset.action = 'destroy'
      contentElement.innerHTML = /*html*/
        `You really want to <ins>permanently</ins> delete these following categories.
        <br>You will not be able to restore them anymore.`
      confirmBtn.dataset.variant = 'danger'
      confirmBtn.innerText = 'Permanently delete them'
    }
  })
)

const selectedActionsDialog = document.querySelector('#selected-actions-dialog')
const selectedActionsForm = selectedActionsDialog.querySelector('form.Dialog__form')
selectedActionsForm?.addEventListener('submit', performAction = async (e) => {
  const closeBtn = selectedActionsDialog.querySelector('[type="submit"][formmethod="dialog"]')
  if (e.submitter === closeBtn) return
  e.preventDefault()
  selectedActionsDialog.ariaBusy = true
  const inputIds = selectedActionsDialog.querySelector('[name="ids"]')
  const action = inputIds.dataset.action
  if (!['restore', 'destroy'].includes(action)) return
  const
    formData = { id: JSON.parse(inputIds.value) },
    method = action === 'destroy' ? 'DELETE' : 'PATCH',
    performActionToManyCategory = fetch('/v1/categories/d', {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) {
          inputIds.value = ''
          selectedActionsDialog.close()
          window.location.reload()
        }
        return res.json()
      })
      .catch(e => console.error(e))
      .finally(() => { selectedActionsDialog.removeAttribute('aria-busy') })
  await performActionToManyCategory
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