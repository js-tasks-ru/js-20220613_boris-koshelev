function getColumnProps(data) {
  const maxValue = Math.max(...data);
  const scale = 50 / maxValue;

  return data.map((item) => {
    return {
      percent: ((item / maxValue) * 100).toFixed(0) + "%",
      value: String(Math.floor(item * scale)),
    };
  });
}

export default class ColumnChart {
  element = null;
  chartHeight = 50;

  constructor(
    {
      data = [],
      label = "",
      value = null,
      link = null,
      formatHeading = (item) => item,
    } = {
        data: [],
        label: "",
        value: null,
        link: null,
        formatHeading: (item) => item,
      }
  ) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
  }

  update(data = []) {
    this.data = data;
    this.render();
  }

  destroy() {
    this.element.innerHTML = "";
  }

  remove() {
    this.element.parentElement.removeChild(this.element);
  }

  getColumns() {
    const columnProps = getColumnProps(this.data);
    return columnProps
      .map(({ value, percent }) => {
        return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
      })
      .join("");
  }

  getTemplate({ displaySkeleton }) {
    const link = this.link
      ? `<a href="${this.link}" class="column-chart__link">View all</a>`
      : "";
    const columns = this.getColumns();
    const value = this.value ? this.formatHeading(this.value) : "";
    const label = this.label ? `Total ${this.label}` : "Total";

    return `
        <div class="column-chart ${displaySkeleton && "column-chart_loading"}" style="--chart-height: 50">
        <div class="column-chart__title">
          ${label}
          ${link}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${value}</div>
          <div data-element="body" class="column-chart__chart">
            ${columns}
          </div>
        </div>
      </div>
        `;
  }

  render() {
    const tempElement = document.createElement("div");
    const displaySkeleton = this.data.length === 0;
    tempElement.innerHTML = this.getTemplate({ displaySkeleton });
    this.element = tempElement.children[0];
  }
}
