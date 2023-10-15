import { qs } from '../helpers/helpers.js'

/**
 *  Popover elements required:
 *  @example: idPopover = eg-popover, idContent = 0
 *  @requires:
 *    trigger: <button data-trigger="popover" popovertarget="eg-popover" data-get="0"></button>
 *    content: < data-content="popover" data-for="eg-popover" data-id="0"></>
 *    popover: < id="eg-popover" popover></>
 * 
 * */

export const __PopoverTriggers = Array.from(qs.$a('button[data-trigger = popover]'))
export const __PopoverContents = Array.from(qs.$a('[data-content = popover]'))
export const __Popovers = Array.from(qs.$a('[popover]'))

__PopoverTriggers.map(btn => btn.addEventListener('click', function __togglePopover () {
  const targetId = btn.getAttribute('popovertarget'),
        contentFrom = btn.dataset.get,
        targetPopover = qs.$o(`#${targetId}[popover]`),
        contentPopover = qs.$o(`[data-for="${targetId}"][data-id="${contentFrom}"][data-content=popover]`)
  if (!(targetPopover && contentPopover)) {
    return
  }

  const content = contentPopover.textContent
  targetPopover.innerText = content
}))