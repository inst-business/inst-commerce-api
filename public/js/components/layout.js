import qs from '../consts.js'
import { toggleExpanded, switchTheme } from '../helpers/helpers.js'

const __SidebarCollapseBtn = qs.$o('#Sidebar-collapse-btn')
const __Sidebar = qs.$o('#Sidebar')
toggleExpanded(__SidebarCollapseBtn, __Sidebar)

const __SwitchThemeBtn = qs.$o('#Swicth-theme-btn')
switchTheme(__SwitchThemeBtn)