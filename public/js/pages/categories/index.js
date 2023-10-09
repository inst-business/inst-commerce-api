import { onLoadContent, getCookie } from '../../helpers/helpers.js'
import validator from '../../components/form/validator.js'
import toast from '../../components/toast.js'
import { ERR } from '../../config/consts.js'


const DeleteCategory = () => {

  const tableRef = document.querySelector('#items-table')
  const dialogRef = document.querySelector('#delete-dialog')
  const token = getCookie('accessToken')
  let id = null

  const setId = (value) => id = value
  const setContent = (name) => {
    dialogRef.querySelector('.Dialog__body').innerHTML =
      /*html*/`You really want to delete <strong>${name}</strong> category?`
  }

  const useToast = (title, message) => toast({
    title: title || 'Error!', message, type: 'danger', duration: 5000, closable: false,
  })

  const _deleteCategory = (category) => fetch('/v1/categories', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: category,
  }).then(async res => await res.json()).catch(e => console.error(e))

  const onClick = e => {
    const triggerRef = e.target.closest('.Item__actions-delete')
    if (!triggerRef) return
    setId(triggerRef.dataset.formId)
    setContent(e.target.closest('.Item').querySelector('.Item__name').innerText)
  }

  const onSubmit = async (data, e) => {
    dialogRef.close()
    if (e.submitter.matches('[type="submit"][formmethod="dialog"]')) return
    // dialogRef.ariaBusy = true
    const res = await _deleteCategory(JSON.stringify({ id }))
    if (res.error) {
      useToast('Delete Failed!', res.error.message)
      return
    }
    // dialogRef.removeAttribute('aria-busy')
    window.location.reload()
  }

  tableRef?.addEventListener('click', onClick)

  validator({
    form: '#delete-dialog > form',
    submit: onSubmit
  })
}


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


onLoadContent(DeleteCategory)