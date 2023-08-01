import { qs } from '../helpers/helpers.js'
import { 
  loadingScreen,
  loadTheme,
  switchTheme,
  loadSidebarState,
  toggleExpanded
} from './storage.js'

document.onload = [
  loadingScreen(),
  loadTheme(),
  loadSidebarState()
]

const __SidebarCollapseBtn = qs.$o('#Sidebar-collapse-btn')
const __Sidebar = qs.$o('#Sidebar')
toggleExpanded(__SidebarCollapseBtn, __Sidebar)

const __SwitchThemeBtn = qs.$o('#Switch-theme-btn')
switchTheme(__SwitchThemeBtn)