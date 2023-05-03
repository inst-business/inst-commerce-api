
const qs = {
  o: document.querySelector.bind(document),
  a: document.querySelectorAll.bind(document),
  $: document.getElementById('app'),
  $o: document.getElementById('app').querySelector.bind(document.getElementById('app')),
  $a: document.getElementById('app').querySelectorAll.bind(document.getElementById('app')),
}

export default qs