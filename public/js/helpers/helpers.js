
export const qs = {
  o: document.querySelector.bind(document),
  a: document.querySelectorAll.bind(document),
  $: document.getElementById('App'),
  $o: document.getElementById('App').querySelector.bind(document.getElementById('App')),
  $a: document.getElementById('App').querySelectorAll.bind(document.getElementById('App')),
}

export const html = ([first, ...strings], ...vals) =>
  vals.reduce((prev, cur) => prev.concat(cur, strings.shift()), [first])
    .filter(v => v && v !== true || v === 0)
    .join('')

    
export const createScene = () => {
  let state = {}
  const roots = new Map()

  function render () {
    for (const [root, component] of roots) {
      // console.log('onRender: ', state)
      root.innerHTML = component(state)
    }
  }

  return {
    mount (component, root, isRendering = false) {
      roots.set(root, component)
      // console.log('onMount: ', state)
      if (isRendering) render()
    },
    dispatch (props, ...args) {
      state = Object.assign(state, props, ...args)
      // console.log('onDispatch: ', state)
      render()
    }
  }
}

export const onLoadContent = (...handlers) => {
  handlers.forEach(handler => {
    document.addEventListener('DOMContentLoaded', handler)
  })
}

export const getCookie = (name) =>
  document.cookie.split(`; `).find(r => r.startsWith(`${name}=`))?.split('=')[1]

export const setCookie = (name, value, maxAge = 86400) => {
  document.cookie = `${name}=${value}; max-age=${maxAge}; Secure; SameSite=Strict;`
}

export const dateFormat = (timestamp, format, local = 'en') => {
  if (!timestamp) return ''
  local = (local != null && typeof local === 'string') ? local : 'en'
  const types = {
    medium: { dateStyle: 'short', timeStyle: 'medium' },
    datetime: { dateStyle: 'medium', timeStyle: 'medium' },
    dateShort: { dateStyle: 'short' },
    timeMedium: { timeStyle: 'medium' },
    time: {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZoneName: 'short'
    },
    date: {
      weekday: 'narrow', day: 'numeric',
      month: 'short', year: 'numeric',
    },
    get detailed () {
      return { ...this.date, ...this.time, }
    },
  } 
  const pattern = (format != null || typeof format !== 'string')
    ? types[format] : types.medium
  const formatter = new Intl.DateTimeFormat(local, pattern)
  return formatter.format(new Date(timestamp))
}

export const isValidFnName = name => {
  const regex = /^[$A-Z_][0-9A-Z_$]*$/i
  return regex.test(name)
}

export const splitOutFnName = (str, all = false) => {
  const
    opts = !all ? 'i' : 'ig',
    regex = new RegExp('[$A-Z_][0-9A-Z_$]*', opts),
    result = str.match(regex)
  return all ? result : result[0]
}

export const getFnValue = (str, all = false) => {
  const
    opts = !all ? 'i' : 'ig',
    regex = new RegExp('(?<![\\w$])\\d+(?![\\w])', opts),
    result = str.match(regex)
  return all ? result : result[0]
}