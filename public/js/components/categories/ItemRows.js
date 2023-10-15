import { html, dateFormat } from '../../helpers/helpers.js'

const ItemRow = ({ data, local = 'en' }) => {
  return html`
    <tr class="Item">
      <td scope="Row">
        <input type="checkbox" class="Check" name="id[]" value="${data._id}" data-select-target="select-all">
      </td>
      <td class="Item__name">
        <a href="/categories{{routeI 'crud.get_one' this._id}}" class="Text-link Text-limit-2">${data.name}</a>
      </td>
      <td class="Item__img" data-size="xs">
        <picture>
          <!-- <source srcset="/uploads/categories/${data.img}" type="image/webp"> -->
          <img src="/uploads/categories/${data.img}" alt="${data.name}" title="${data.name}"
            loading="lazy" decoding="async" fetchpriority="true"
            class="Img" data-variant="thumbnail" data-dialog-target="#viewimage-dialog">
        </picture>
      </td>
      <td class="Item__desc">
        <p class="Text-limit-2">${data.desc || '-'}</p>
      </td>
      <td class="">
        <a href="/u/${data.createdBy.username}" class="Text-link">${data.createdBy.username}</a>
      </td>
      <td class="Item__time">
        ${dateFormat(data.createdAt, 'dateShort')}<br>${dateFormat(data.createdAt, 'timeMedium')}
      </td>
      <td class="Item__time">
        ${dateFormat(data.editedAt, 'dateShort') || '-'}<br>${dateFormat(data.editedAt, 'timeMedium')}
      </td>
      <td class="Item__actions">
        <a href="/categories/${data._id}/create" title="New sub-category"
          class="Btn" data-size="" data-variant="success unstyled">
          <i class="fa-regular fa-file-circle-plus"></i>
        </a>
        <a href="/categories/${data._id}/edit" title="Edit"
          class="Btn" data-size="" data-variant="info unstyled">
          <i class="fa-regular fa-pen-line"></i>
        </a>
        <button title="Delete" data-dialog-target="#delete-dialog" data-form-id="${data._id}"
          class="Item__actions-delete Btn" data-size="" data-variant="danger unstyled">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `
}

const ItemRows = ({ data }) => {
  return html`${data.length > 0
    ? data.map(item => ItemRow({ data: item }))
    : /*html*/`
    <tr class="hover-0">
      <td colspan="8">
        <p class="Text-muted Text-center" style="line-height: 2.75;"><em>(No data found)</em></p>
      </td>
    </tr>
    `
  }`
}

export default ItemRows