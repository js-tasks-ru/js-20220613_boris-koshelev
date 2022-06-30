const sortStrings = (str1, str2, direction) => {
  let [compareStr1, compareStr2] = [str1, str2];
  if (direction === "desc") {
    [compareStr1, compareStr2] = [compareStr2, compareStr1];
  }

  return compareStr1.localeCompare(compareStr2, ["ru", "en"], {
    caseFirst: "upper",
  });
};

const sortNumbers = (num1, num2, direction) => {
  if (direction === "asc") {
    return num1 - num2;
  } else {
    return num2 - num1;
  }
};

const sortByType = {
  number: sortNumbers,
  string: sortStrings,
};

export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get header() {
    return this.headerConfig
      .map(({ id, title, sortable }) => {
        return /* HTML */ ` <div
          class="sortable-table__cell"
          data-id="${id}"
          data-sortable="${sortable}"
        >
          <span>${title}</span>
        </div>`;
      })
      .join("");
  }

  get body() {
    return this.data
      .map((tableRowData) => {
        const row = this.headerConfig
          .map(({ id, sortType }) => {
            let content = null;
            if (sortType === "number") {
              content = tableRowData[id];
            }
            if (sortType === "string") {
              content = tableRowData[id];
            }

            return `<div class="sortable-table__cell">${content}</div>`;
          })
          .join("");

        return `<a class="sortable-table__row">${row}</a>`;
      })
      .join("");
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  sort(field, direction = "asc") {
    const headerData = this.headerConfig.find(
      (headerData) => headerData.id === field
    );

    this.data.sort((firstRowData, secondRowData) => {
      let [sortElem1, sortElem2] = [firstRowData[field], secondRowData[field]];

      return sortByType[headerData.sortType](sortElem1, sortElem2, direction);
    });

    this.subElements.body.innerHTML = this.body;
  }

  get template() {
    return /* HTML */ `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div
            data-element="header"
            class="sortable-table__header sortable-table__row"
          ></div>
          <div data-element="body" class="sortable-table__body"></div>
          <div
            data-element="loading"
            class="loading-line sortable-table__loading-line"
          ></div>
          <div
            data-element="emptyPlaceholder"
            class="sortable-table__empty-placeholder"
          >
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">
                Reset all filters
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getSubElements() {
    const result = {};

    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  render() {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = this.template;
    this.element = tempElement.firstElementChild;

    this.subElements = this.getSubElements();

    this.subElements.header.innerHTML = this.header;
    this.subElements.body.innerHTML = this.body;
  }
}
