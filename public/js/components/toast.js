
const toast = ({
  title = '',
  message = '',
  type = 'success',
  closable = true,
  icon = null,
  duration = 3000,
  direction = 'left',
  triggeredBy = null,
  container = '.Toasts'
}) => {
  const toastsMain = document.querySelector(container)
  if (!toastsMain || !message) return

  const toast = document.createElement('div')
  const autoDestroy = setTimeout(() => {
    toastsMain.removeChild(toast)
  }, duration + 150)

  toast.onclick = e => {
    if (closable === true && e.target.closest('.toast__close')) {
      toastsMain.removeChild(toast)
      clearTimeout(autoDestroy)
    }
  }

  const defaultIcons = {
    success: 'fa-solid fa-circle-check',
    info: 'fa-duotone fa-circle-question',
    warning: 'fa-duotone fa-circle-exclamation',
    danger: 'fa-solid fa-circle-xmark',
  }

  // toast.classList.add('Toast', `Toast-${type}`)
  toast.classList.add('Toast')
  toast.dataset.variant = type
  const delay = (duration / 1000).toFixed(2)
  toast.style.animation = `toastFloatIn ease .35s, toastFadeOut linear .15s ${delay}s forwards`
  toast.style.setProperty('--Toast-duration', duration + 'ms')

  toast.innerHTML = /*html*/`
    <div class="Toast__icon">
      <i class="${icon || defaultIcons?.[type]}"></i>
    </div>
    <div class="Toast__content">
      ${title && /*html*/`<div class="Toast__content-title">${title}</div>`}
      <div class="Toast__content-message">${message}</div>
    </div>
    ${closable === true ? /*html*/`
      <div class="Toast__close">
        <i class="fa-regular fa-xmark"></i>
      </div>
    ` : ''}
  `
  // console.log(toastsMain, toast.innerHTML)
  toastsMain.appendChild(toast)
}

export default toast

// const
//   btnSuccess = $('button.btn-success'),
//   btnInfo = $('button.btn-info'),
//   btnWarning = $('button.btn-warning'),
//   btnDanger = $('button.btn-danger')
      
// btnSuccess.addEventListener('click', () => {
//   toast({
//     title: 'Success!',
//     message: 'Task completed successfully.',
//     type: 'success',
//   })
// })
// btnInfo.addEventListener('click', () => {
//   toast({
//     title: 'Info!',
//     message: 'Information about task',
//     type: 'info',
//   })
// })
// btnWarning.addEventListener('click', () => {
//   toast({
//     title: 'Warning!',
//     message: 'Caution about this task',
//     type: 'warning',
//   })
// })
// btnDanger.addEventListener('click', () => {
//   toast({
//     // title: 'Danger!',
//     message: 'Something went wrong, please try again.',
//     type: 'danger',
//     duration: 1000,
//     closable: false,
//   })
// })