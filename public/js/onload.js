import { loadTheme, loadSidebarState } from './helpers/helpers.js'

document.onload = [
  loadTheme(),
  loadSidebarState()
]