import { qs } from '../helpers/helpers.js'

// Onload
export const loadingScreen = () => {
  setTimeout(() => {
    qs.$.classList.remove('App-onload')
  }, 300)
}


// Toggle theme
const themeModes = ['light', 'dark']
const storeTheme = (mode) => {
  localStorage.setItem('theme', mode)
}
export const loadTheme = (switcher) => {
  if (!switcher || switcher.nodeName !== 'INPUT' || switcher.type !== 'checkbox')
    return
  const theme = localStorage.getItem('theme')
  if (theme && themeModes.includes(theme)) {
    const Root = qs.o('html')
    Root.dataset.theme = theme
    switcher.checked = (theme === 'dark') ? true : false
  }
}
export const switchTheme = (switcher) => {
  if (!switcher || switcher.nodeName !== 'INPUT' || switcher.type !== 'checkbox')
    return
  switcher.addEventListener('click', function switchRootTheme (e) {
    const Root = qs.o('html')
    const theme = (Root.dataset?.theme === 'dark') ? Root.dataset.theme : 'light'
    const switchedTheme = (theme === 'light') ? 'dark' : 'light'
    Root.dataset.theme = switchedTheme
    // switcher.checked = (theme === 'dark') ? true : false
    storeTheme(switchedTheme)
  })
}


// Toggle Sidebar
const storeSidebarState = (state) => {
  localStorage.setItem('sidebarExpanded', state)
}
export const loadSidebarState = () => {
  const state = localStorage.getItem('sidebarExpanded')
  if (state) {
    const Sidebar = qs.$o('#Sidebar')
    Sidebar.setAttribute('aria-expanded', state)
  }
}
export const toggleExpanded = (btn, target) => {
  if (!btn) return
  btn.addEventListener('click', function expandTarget (e) {
    const expanded = (target.getAttribute('aria-expanded') === 'true') ? true : false
    target.setAttribute('aria-expanded', !expanded)
    storeSidebarState(!expanded)
  })
}