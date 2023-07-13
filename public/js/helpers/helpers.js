import qs from '../consts.js'

export const toggleExpanded = (btn, target) => {
  btn.addEventListener('click', function expandTarget (e) {
    const expanded = (target.getAttribute('aria-expanded') === 'true') ? true : false
    target.setAttribute('aria-expanded', !expanded)
  })
}

export const switchTheme = (btn) => {
  btn.addEventListener('click', function switchRootTheme (e) {
    const Root = qs.o('html')
    const theme = (Root.dataset?.theme === 'dark') ? Root.dataset.theme : 'light'
    const switchedTheme = (theme === 'light') ? 'dark' : 'light'
    Root.dataset.theme = switchedTheme
  })
}