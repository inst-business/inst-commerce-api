import { qs } from '../helpers/helpers.js'
import { 
  loadingScreen,
  loadTheme,
  switchTheme,
  loadSidebarState,
  toggleExpanded
} from './storage.js'

const __SwitchThemeBtn = qs.$o('#Switch-theme-btn')

document.onload = [
  loadTheme(__SwitchThemeBtn),
  loadSidebarState(),
  loadingScreen(),
]

switchTheme(__SwitchThemeBtn)

const __SidebarCollapseBtn = qs.$o('#Sidebar-collapse-btn')
const __Sidebar = qs.$o('#Sidebar')
toggleExpanded(__SidebarCollapseBtn, __Sidebar)
