import validator from '../../components/form/validator.js'
import '../../components/form/prototypes.js'
import toast from '../../components/toast.js'
import { ERR } from '../../config/consts.js'


const Account = async () => {

  const formSelector = 'form#form-login'
  const useToast = (message) => toast({
    title: 'Login failed!', message, type: 'danger', duration: 5000, closable: false,
  })
  const setAccessToken = (token) => {
    document.cookie = `accessToken=${token}; max-age=1440; Secure; SameSite=Strict;`
  }
  const _login = async (url, user) => await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then(async res => await res.json()).catch(e => console.error(e))

  const onSubmit = async (data) => {
    const formRef = document.querySelector(formSelector)
    const res = await _login(formRef?.action, data)
    if (res.error) {
      // if (res.error.code === ERR.INVALID_DATA) {
      //   res.error?.pars?.forEach(par => {
      //     console.log(par.field)
      //   })
      // }
      useToast(res.error.message)
      return
    }
    setAccessToken(res.accessToken)
    const queryParams = new URLSearchParams(window.location.search)
    window.location.replace(queryParams.get('redirect') || '/')
  }

  validator({
    form: formSelector,
    rules: [
      ['userInfo', 'required'],
      ['password', 'required'],
    ],
    field: '.Field',
    label: '.Field__label',
    response: '.Field__response',
    submit: onSubmit
  })

}

document.addEventListener('DOMContentLoaded', Account)