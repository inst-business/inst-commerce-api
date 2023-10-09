export const useState = (initValue) => {
  let value = initValue
  const getValue = () => value
  const setValue = v => value = v
  return [getValue, setValue]
}