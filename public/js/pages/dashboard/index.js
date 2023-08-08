import validator from '../../components/form/validator.js'
import '../../components/form/prototypes.js'


validator({
  form: '#instance-form',
  rules: [
    ['username', 'required min:3 max:16'],
    ['password', 'required password'],
    ['email', 'required email'],
    ['password-confirm', 'required confirmed', 'password'],
    ['tel', 'required'],
    ['country', 'required'],
    ['gender', 'required'],
    ['hobbies', 'required'],
  ],
  field: '.Field',
  label: '.Field__label',
  response: '.Field__response',
  submit (data) {
    console.log('data: ', data)
  }
})