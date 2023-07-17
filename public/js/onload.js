import { loadingScreen, loadTheme, loadSidebarState } from './helpers/helpers.js'

document.onload = [
  loadingScreen(),
  loadTheme(),
  loadSidebarState()
]