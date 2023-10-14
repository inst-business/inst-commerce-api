import { html, createScene, onLoadContent, getCookie } from '../../helpers/helpers.js'
import ItemRows from '../../components/categories/ItemRows.js'
import validator from '../../components/form/validator.js'
import toast from '../../components/toast.js'
import { ERR } from '../../config/consts.js'

const token = getCookie('accessToken')
const listScene = createScene()
listScene.mount(ItemRows, document.querySelector('#items-table tbody'), false)
const _getCategory = () => fetch('/v1/categories', {
  method: 'GET',
  headers: {
    'authorization': `Bearer ${token}`,
  },
}).then(async res => await res.json()).catch(e => console.error(e))


const ViewImage = () => {
  
  const tableRef = document.querySelector('#items-table')
  const dialogRef = document.querySelector('#viewimage-dialog')
  const displayRef = dialogRef?.querySelector('.Dialog__img')
  const setImage = ({ src, alt }) => {
    displayRef.src = src
    displayRef.alt = alt
  }

  const onClickImage = e => {
    const previewRef = e.target.closest('.Item__img img')
    if (!(dialogRef && displayRef && previewRef)) return
    if (!(previewRef.complete && previewRef.naturalWidth > 0)) {
      dialogRef.close()
      return
    }
    setImage(previewRef)
  }

  tableRef?.addEventListener('click', onClickImage)
}


const DeleteCategory = () => {

  const tableRef = document.querySelector('#items-table')
  const dialogRef = document.querySelector('#delete-dialog')
  let id = null

  const setId = (value) => id = value
  const setContent = (name) => {
    dialogRef.querySelector('.Dialog__body').innerHTML =
      /*html*/`You really want to delete <strong>${name}</strong> category?`
  }

  const useToast = (type, title, message) => toast({
    title: title || 'Error!', message, type: type || 'danger', duration: 4000, closable: false,
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

  const onClickDeleteButton = e => {
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
      useToast('danger', 'Delete Failed!', res.error.message)
      return
    }
    useToast('success', 'Deleted Successfully!', 'Category has been removed.')
    const list = await _getCategory()
    listScene.dispatch({ data: list })
    // dialogRef.removeAttribute('aria-busy')
    // window.location.reload()
  }

  tableRef?.addEventListener('click', onClickDeleteButton)

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


onLoadContent(ViewImage, DeleteCategory)