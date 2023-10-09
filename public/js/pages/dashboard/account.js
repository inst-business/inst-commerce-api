import { onLoadContent, setCookie } from '../../helpers/helpers.js'
import validator from '../../components/form/validator.js'
import '../../components/form/prototypes.js'
import toast from '../../components/toast.js'
import { ERR } from '../../config/consts.js'


const Account = async () => {

  const useToast = (message) => toast({
    title: 'Login failed!', message, type: 'danger', duration: 5000, closable: false,
  })
  const _login = (user) => fetch('/v1/a/e/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: user,
  }).then(async res => await res.json()).catch(e => console.error(e))

  const onSubmit = async (data) => {
    const res = await _login(JSON.stringify(data))
    if (res.error) {
      // if (res.error.code === ERR.INVALID_DATA) {
      //   res.error?.pars?.forEach(par => {
      //     console.log(par.field)
      //   })
      // }
      useToast(res.error.message)
      return
    }
    setCookie('accessToken', res.accessToken)
    const queryParams = new URLSearchParams(window.location.search)
    window.location.replace(queryParams.get('redirect') || '/')
  }

  validator({
    form: 'form#form-login',
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

onLoadContent(Account)