import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  constructor(headersConfig = [], {
    sorted = {},
    isSortLocally = false,
    url,
    data = []
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.url = url;

    this.render();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow({ id, title, sortable }) {
    return /* HTML */`
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  getTableRows(data = []) {
    return data.map(item => {
      return /* HTML */`
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>`;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return {
        id,
        template
      };
    });

    return cells.map(({ id, template }) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  get template() {
    return /* HTML */ `
      <div class="sortable-table sortable-table_loading">
      ${this.getTableHeader()}
      <div data-element="body" class="sortable-table__body"></div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
      </div>`;
  }

  handleHeaderCellClick = (event) => {
    const tableHeader = event.target.closest(".sortable-table__cell");

    if (tableHeader) {
      const { id, sortable, order } = tableHeader.dataset;
      if (sortable === 'true') {
        let newOrder = null;
        if (order) {
          if (order === 'asc') {
            newOrder = 'desc';
          } else {
            newOrder = 'asc';
          }
        } else {
          newOrder = 'desc';
        }

        this.sort(id, newOrder);
      }
    }
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    this.subElements.header.addEventListener("pointerdown", this.handleHeaderCellClick);

    await this.updateData();
  }

  rerenderTable() {
    this.subElements.body.innerHTML = this.getTableRows(this.data);
  }

  sort(field, order) {

    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;


    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  sortOnClient(id, order) {
    this.data = this.sortData(id, order);
    this.rerenderTable();
  }

  sortOnServer = async (id, order) => {
    this.data = await this.getData({ id, order });

    if (this.data.length === 0) {
      this.element.classList.add("sortable-table_empty");
    } else {
      this.rerenderTable();
    }
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  async updateData() {
    this.element.classList.add("sortable-table_loading");
    this.data = await this.getData();
    this.element.classList.remove("sortable-table_loading");
    this.rerenderTable();
  }

  async getData({ id, order } = {}) {
    const url = new URL(this.url, BACKEND_URL);

    if (id) {
      url.searchParams.set("_sort", id);
      url.searchParams.set("_order", order);
    }

    return await fetchJson(url.toString());
  }
}
