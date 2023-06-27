
const qs = {
  o: document.querySelector.bind(document),
  a: document.querySelectorAll.bind(document),
  $: document.getElementById('App'),
  $o: document.getElementById('App').querySelector.bind(document.getElementById('App')),
  $a: document.getElementById('App').querySelectorAll.bind(document.getElementById('App')),
}

export default qs