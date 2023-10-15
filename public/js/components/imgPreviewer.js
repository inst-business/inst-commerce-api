import { qs } from '../helpers/helpers.js'

const pattern = 'input[type=file]'
export const __ImgInputFiles = Array.from(qs.$a(`${pattern}[data-previewer-target]`))
export const __ImgPreviewers = Array.from(qs.$a('.Previewer'))

__ImgInputFiles.map(input => input.addEventListener('change',
  function __setPreviewImage () {
    const
      target = input.dataset.previewerTarget,
      previewer = qs.$o(`.Previewer${target}`),
      [ file ] = input.files
    if (!file || !previewer) {
      return
    }
    previewer.src = URL.createObjectURL(file)
  }
))