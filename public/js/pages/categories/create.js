import validator from '../../components/form/validator.js'
import '../../components/form/prototypes.js'
import toast from '../../components/toast.js'
import { ERR } from '../../config/consts.js'


const ViewImage = async () => {
  
  const previewRef = document.querySelector('#preview-img')
  const dialogRef = document.querySelector(previewRef?.dataset.dialogTarget)
  const displayRef = dialogRef?.querySelector('.Dialog__img')
  const setImage = ({src, alt}) => {
    displayRef.src = src
    displayRef.alt = alt
  }

  const onClick = () => {
    if (!(dialogRef && displayRef)) return
    if (!previewRef.complete || previewRef.naturalWidth <= 0) {
      dialogRef.close()
      return
    }
    setImage(previewRef)
  }

  previewRef?.addEventListener('click', onClick)
}


const CreateCategory = async () => {

  const formSelector = 'form#form-create'
  const useToast = (message) => toast({
    title: 'Error!', message, type: 'danger', duration: 5000, closable: false,
  })
  const _createCategory = async (url, category) => await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(category),
  }).then(async res => await res.json()).catch(e => console.error(e))

  const onSubmit = async (data) => {
    const formRef = document.querySelector(formSelector)
    const res = await _createCategory(formRef?.action, data)
    if (res.error) {
      useToast(res.error.message)
      return
    }
    window.location.replace('/categories')
  }

  validator({
    form: formSelector,
    rules: [
      ['name', 'required min:1 max:48'],
      ['slug', 'max:48'],
      ['img', 'required'],
    ],
    field: '.Field',
    label: '.Field__label',
    response: '.Field__response',
    submitFormData: onSubmit
  })
}

document.addEventListener('DOMContentLoaded', ViewImage)
document.addEventListener('DOMContentLoaded', CreateCategory)
