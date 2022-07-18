import RangePicker from "./components/range-picker/src/index.js";
import SortableTable from "./components/sortable-table/src/index.js";
import ColumnChart from "./components/column-chart/src/index.js";
import header from "./bestsellers-header.js";

import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class Page {
  pageElements = {
    charts: [],
  };

  constructor() {}

  get template() {
    return /* HTML */ `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <!-- RangePicker component -->
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <!-- column-chart components -->
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div
            data-element="customersChart"
            class="dashboard__chart_customers"
          ></div>
        </div>

        <h3 class="block-title">Best sellers</h3>

        <div data-element="sortableTable">
          <!-- sortable-table component -->
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.pageElements.rangePicker = new RangePicker();

    this.subElements.rangePicker.append(this.pageElements.rangePicker.element);

    const { from, to } = this.pageElements.rangePicker.selected;

    this.pageElements.charts.push(
      new ColumnChart({
        url: "api/dashboard/orders",
        label: "orders",
        link: "#",
        range: {
          from,
          to,
        },
      })
    );

    this.pageElements.charts.push(
      new ColumnChart({
        url: "api/dashboard/sales",

        label: "sales",
        formatHeading: (data) => `$${data}`,
      })
    );

    this.pageElements.charts.push(
      new ColumnChart({
        url: "api/dashboard/customers",
        label: "customers",
      })
    );

    for (let chart of this.pageElements.charts) {
      this.subElements.chartsRoot.append(chart.element);
    }

    this.pageElements.sortableTable = new SortableTable(header, {
      url: "api/rest/products",
    });

    this.subElements.sortableTable.append(
      this.pageElements.sortableTable.element
    );

    this.initEventListeners();

    return this.element;
  }

  async update(from, to) {
    for (const chart of this.pageElements.charts) {
      chart.update(from, to);
    }
  }

  remove() {
    this.element.remove();
    document.removeEventListener("date-select", this.handleUpdateData);
  }

  destroy() {
    this.element.remove();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  handleUpdateData = (event) => {
    const { from, to } = event.detail;

    this.update(from, to);
  };

  initEventListeners() {
    document.addEventListener("date-select", this.handleUpdateData);
  }
}
