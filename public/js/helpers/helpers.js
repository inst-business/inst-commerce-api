
export const qs = {
  o: document.querySelector.bind(document),
  a: document.querySelectorAll.bind(document),
  $: document.getElementById('App'),
  $o: document.getElementById('App').querySelector.bind(document.getElementById('App')),
  $a: document.getElementById('App').querySelectorAll.bind(document.getElementById('App')),
}

export const isValidFnName = name => {
  const regex = /^[$A-Z_][0-9A-Z_$]*$/i
  return regex.test(name)
}

export const splitOutFnName = (str, all = false) => {
  const opts = !all ? 'i' : 'ig',
        regex = new RegExp('[$A-Z_][0-9A-Z_$]*', opts),
        result = str.match(regex)
  return all ? result : result[0]
}

export const getFnValue = (str, all = false) => {
  const opts = !all ? 'i' : 'ig',
        regex = new RegExp('(?<![\\w$])\\d+(?![\\w])', opts),
        result = str.match(regex)
  return all ? result : result[0]
}