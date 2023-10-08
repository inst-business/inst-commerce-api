import validator from '../../components/form/validator.js'
import '../../components/form/prototypes.js'
import toast from '../../components/toast.js'
import { ERR } from '../../config/consts.js'

const formSelector = 'form#form-create'

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
  async submitFormData (data) {
    const form = document.querySelector(formSelector)
    const url = form?.action
    // const formData = Object.entries(data).reduce((formData, [key, value]) => {
    //   formData.append(key, value)
    //   return formData
    // }, new FormData())
    const createCategory = fetch(url, {
      method: 'POST',
      body: data,
    }).then(async (res) => {
      if (res.ok) {
        window.location.replace('/categories')
      }
      else {
        const err = await res.json()
        if (err.error?.code === ERR.INVALID_DATA) {
          err.error?.pars?.forEach(par => {
            console.log(par.field)
          })
        }
        toast({
          // title: 'Danger!',
          message: err.error.message,
          type: 'danger',
          duration: 3000,
          closable: false,
        })
      }
      // return res.json()
    }).catch(e => console.error(e))
    await createCategory
  }
})

const dialogImgToggle = document.querySelector('#preview-img')
dialogImgToggle?.addEventListener('click', e => {
  const dialog = document.querySelector(dialogImgToggle.dataset.dialogTarget)
  if (!dialog) return
  if (!dialogImgToggle.complete || dialogImgToggle.naturalWidth <= 0) {
    dialog.close()
    return
  }
  dialog.querySelector('.Dialog__header').innerText = img.alt
  const dialogImg = dialog.querySelector('.Dialog__img')
  if (!dialogImg) return
  dialogImg.src = dialogImgToggle.src
  dialogImg.alt = dialogImgToggle.alt
})
