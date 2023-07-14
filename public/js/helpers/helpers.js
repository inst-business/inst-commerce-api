import qs from '../consts.js'

const themeModes = ['light', 'dark']
const storeTheme = (mode) => {
  localStorage.setItem('theme', mode)
}
export const loadTheme = () => {
  const theme = localStorage.getItem('theme')
  if (theme && themeModes.includes(theme)) {
    const Root = qs.o('html')
    Root.dataset.theme = theme
  }
}
export const switchTheme = (btn) => {
  btn.addEventListener('click', function switchRootTheme (e) {
    const Root = qs.o('html')
    const theme = (Root.dataset?.theme === 'dark') ? Root.dataset.theme : 'light'
    const switchedTheme = (theme === 'light') ? 'dark' : 'light'
    Root.dataset.theme = switchedTheme
    storeTheme(switchedTheme)
  })
}


const storeSidebarState = (state) => {
  localStorage.setItem('sidebarExpanded', state)
}
export const loadSidebarState = () => {
  const state = localStorage.getItem('sidebarExpanded')
  if (state) {
    const Sidebar = qs.$o('#Sidebar')
    console.log(state, Sidebar.getAttribute('aria-expanded'))
    Sidebar.setAttribute('aria-expanded', state)
  }
}
export const toggleExpanded = (btn, target) => {
  btn.addEventListener('click', function expandTarget (e) {
    const expanded = (target.getAttribute('aria-expanded') === 'true') ? true : false
    target.setAttribute('aria-expanded', !expanded)
    storeSidebarState(!expanded)
  })
}