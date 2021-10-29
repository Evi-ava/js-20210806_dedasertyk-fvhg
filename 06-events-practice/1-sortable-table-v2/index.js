export default class SortableTable {

  element = null;
  subElements = {};

  onSortedClick = event => {
    const element = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        'asc': 'desc',
        'desc': 'asc'
      }

      return orders[order];
    }

    if(element) {
      const {arrow} = this.subElements;
      const {id, order} = element.dataset;

      this.update(id, toggleOrder(order));
      element.dataset.order = toggleOrder(order);
      element.append(arrow);
    }
  }

  constructor(headerConfig = [], {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
    this.subElements = this.getSubElements();
    this.initialize();
  }

  getSubElements() {
    const result = {};

    const elements = [...this.element.querySelectorAll('[data-element]')];

    for(const elem of elements) {
      result[elem.dataset.element] = elem;
    }

    return result;
  }

  render() {
    const wrapper = document.createElement('div');

    const {id, order} = this.sorted;
    const sortedData = this.sortData(id, order);

    wrapper.innerHTML = this.getTemplate(sortedData);

    this.element = wrapper.firstElementChild;
  }

  getTemplate(data) {
    return `<div class="sortable-table">
          ${this.getHeader()}
          ${this.getTable(data)}
    </div>`;
  }

  getHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeaderRow()}
    </div>`;
  }

  getHeaderRow() {

    const {id, order} = this.sorted;

    return this.headerConfig.map(column => {
          return `
          <div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}" data-order="${id === column.id ? order : 'asc'}">
            <span>${column.title}</span>

            ${this.addArrow(id, column.id)}
          </div>
          `;

    }).join('');

  }

  addArrow(id, columnId) {
    const template = `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`

    return id === columnId ? template : '';
  }

  getTable(data = []) {
    return `<div data-element="body" class="sortable-table__body">
      ${this.getRows(data)}
    <div>`;
  }

  getRows(data = []) {

    const columns = this.headerConfig.map(column => {
      return {
        id: column.id,
        template: column.template,
      }
    });

    return data.map(row => {
      return `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">${this.getCells(row, columns)}</a>`
    }).join('');
  } 

  getCells(row, columns) {
    
    return columns.map(({id, template}) => {
      return template ? template(row.images) : `<div class="sortable-table__cell">${row[id]}</div>`;
    }).join('');
  }

  update(id, order) {
    const {body} = this.subElements;

    const newData = this.sortData(id, order);

    body.innerHTML = this.getRows(newData);
  }

  sortData(id, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[id] - b[id]);
      case 'string':
        return direction * a[id].localeCompare(b[id], 'ru');
      case 'custom':
        return direction * customSorting(a, b);
      default:
        return direction * (a[id] - b[id]);
      }
    });
  }

  initialize() {
    this.element.addEventListener('pointerdown', this.onSortedClick);
  }

  destroy() {
    this.remove();
  }

  remove() {
    if(this.element) {
      this.element.remove();
    }
  }
}
