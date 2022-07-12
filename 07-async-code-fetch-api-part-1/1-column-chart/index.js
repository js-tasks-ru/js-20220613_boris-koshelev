import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element = null;
    chartHeight = 50;

    constructor(
        {
            url = "",
            range = {},
            label = "",
            link = null,
            formatHeading = (item) => item,
        } = {}
    ) {
        this.label = label;
        this.link = link;
        this.formatHeading = formatHeading;
        this.url = url;
        this.range = range;

        this.render();
        this.updateData();
    }

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }

    getColumns(data = {}) {
        const columnProps = this.getColumnProps(data);
        return columnProps
            .map(({ value, percent }) => {
                return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
            })
            .join("");
    }

    getValue(value) {
        return value ? this.formatHeading(value) : "";
    }

    getTemplate() {
        const link = this.link
            ? `<a href="${this.link}" class="column-chart__link">View all</a>`
            : "";
        const label = this.label ? `Total ${this.label}` : "Total";

        return `
          <div class="column-chart" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            ${label}
            ${link}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header"></div>
            <div data-element="body" class="column-chart__chart">
            </div>
          </div>
        </div>
          `;
    }

    render() {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = this.getTemplate();
        this.element = tempElement.firstElementChild;
        this.subElements = this.getSubElements(this.element);
    }

    getColumnProps(data) {
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;

        return data.map((item) => {
            return {
                percent: ((item / maxValue) * 100).toFixed(0) + "%",
                value: String(Math.floor(item * scale)),
            };
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

    getData = async () => {
        const url = new URL(this.url, BACKEND_URL);
        url.searchParams.set("from", this.range.from.toISOString());
        url.searchParams.set("to", this.range.to.toISOString());

        return await fetchJson(url);
    }

    async updateData() {
        this.element.classList.add("column-chart_loading");
        const data = await this.getData();

        const value = this.getValue(Object.entries(data).reduce((acc, [, value]) => acc + value, 0));
        this.subElements.header.innerHTML = value;

        this.subElements.body.innerHTML = this.getColumns(Object.entries(data).map(([, value]) => value));

        this.element.classList.remove("column-chart_loading");

        return data;
    }

    update = async (from, to) => {
        this.range = {
            from,
            to
        };
        const data = await this.updateData();
        return data;
    }
}
