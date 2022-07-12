import escapeHtml from "./utils/escape-html.js";
import fetchJson from "./utils/fetch-json.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";
export default class ProductForm {
  constructor(productId = null) {
    this.productId = productId;
    this.mode = productId ? "update" : "add";
  }

  async initEmptyForm() {
    const categoriesData = await this.loadCategoriesData();
    this.categoriesData = categoriesData;

    this.updateSubCategoryList();
  }

  async initFillForm() {
    const [categoriesData, productData] = await Promise.all([this.loadCategoriesData(), this.loadProductData()]);

    this.productData = productData[0];
    this.categoriesData = categoriesData;

    this.updateForm();
  }

  updateForm() {
    this.subElements.productForm.elements["title"].value =
      this.productData.title;
    this.subElements.productForm.elements["description"].value =
      this.productData.description;

    this.subElements.productForm.elements["subcategory"].value =
      this.productData.subcategory;

    this.subElements.productForm.elements["price"].value =
      this.productData.price;

    this.subElements.productForm.elements["discount"].value =
      this.productData.discount;

    this.subElements.productForm.elements["quantity"].value =
      this.productData.quantity;

    this.subElements.productForm.elements["status"].value =
      this.productData.status;

    this.updateSubCategoryList();
    this.updateImageList();
  }

  updateImageList() {
    this.subElements.imageListContainer.innerHTML = `
        <ul class="sortable-list">
        ${this.productData.images
        .map(({ source, url }) => {
          return /* HTML */ `
              <li
                class="products-edit__imagelist-item sortable-list__item"
                style=""
              >
                <input type="hidden" name="url" value="${url}" />
                <input type="hidden" name="source" value="${source}" />
                <span>
                  <img src="icon-grab.svg" data-grab-handle="" alt="grab" />
                  <img
                    class="sortable-table__cell-img"
                    alt="Image"
                    src="${url}"
                  />
                  <span>${source}</span>
                </span>
                <button type="button">
                  <img
                    src="icon-trash.svg"
                    data-delete-handle=""
                    alt="delete"
                  />
                </button>
              </li>
            `;
        })
        .join("")}
        </ul>
        `;
  }

  updateSubCategoryList() {
    this.subElements.productForm.elements["subcategory"].innerHTML =
      this.categoriesData
        .map(({ subcategories, title: categoryTitle }) => {
          return subcategories.map(({ id, title }) => {
            return `<option value="${id}">${categoryTitle} > ${title}</option>`;
          });
        })
        .flat()
        .join("");
  }

  async loadProductData() {
    const url = new URL("/api/rest/products", BACKEND_URL);
    url.searchParams.set("id", this.productId);

    return await fetchJson(url);
  }

  async loadCategoriesData() {
    const url = new URL("/api/rest/categories", BACKEND_URL);
    url.searchParams.set("_sort", "weight");
    url.searchParams.set("_refs", "subcategory");

    return await fetchJson(url);
  }

  async addNewImage(formData) {
    const url = new URL("https://api.imgur.com/3/image");

    return await fetchJson(url, {
      method: "post",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });
  }

  async createNewProduct(data) {
    await fetchJson("https://course-js.javascript.ru/api/rest/products", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(data) {
    await fetchJson("https://course-js.javascript.ru/api/rest/products", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  get template() {
    return /* HTML */ `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input
                required=""
                type="text"
                name="title"
                id="title"
                class="form-control"
                placeholder="Название товара"
              />
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea
              required=""
              class="form-control"
              id="description"
              name="description"
              data-element="productDescription"
              placeholder="Описание товара"
            ></textarea>
          </div>
          <div
            class="form-group form-group__wide"
            data-element="sortable-list-container"
          >
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list"></ul>
            </div>
            <button
              type="button"
              name="uploadImage"
              class="button-primary-outline"
            >
              <span>Загрузить</span>
            </button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select
              class="form-control"
              name="subcategory"
              id="subcategory"
            ></select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input
                required=""
                id="price"
                type="number"
                name="price"
                class="form-control"
                placeholder="100"
              />
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input
                id="discount"
                required=""
                type="number"
                name="discount"
                class="form-control"
                placeholder="0"
              />
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input
              required=""
              type="number"
              class="form-control"
              id="quantity"
              name="quantity"
              placeholder="1"
            />
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status" id="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              ${this.mode === "add" ? "Добавить товар" : "Сохранить товар"}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  async render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    this.addEvents();

    if (this.mode === "add") {
      await this.initEmptyForm();
    } else {
      await this.initFillForm();
    }

    return this.element;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

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

  async save() {
    let formData = new FormData(this.subElements.productForm);

    const newProductData = {
      description: escapeHtml(formData.get("description")),
      discount: Number(formData.get("discount")),
      id: escapeHtml(this.productData.id),
      images: [],
      price: Number(formData.get("price")),
      quantity: Number(formData.get("quantity")),
      status: Number(formData.get("status")),
      subcategory: escapeHtml(formData.get("subcategory")),
      title: escapeHtml(formData.get("title")),
    };

    const urls = formData.getAll("url");
    const sources = formData.getAll("source");

    for (let i = 0; i < urls.length; i++) {
      newProductData.images.push({
        url: urls[i],
        source: sources[i],
      });
    }

    await this.updateProduct(newProductData);

    this.element.dispatchEvent(new CustomEvent("product-updated", {}));
  }

  async add() {
    let formData = new FormData(this.subElements.productForm);

    const newProductData = {
      description: escapeHtml(formData.get("description")),
      discount: Number(formData.get("discount")),
      images: [],
      price: Number(formData.get("price")),
      quantity: Number(formData.get("quantity")),
      status: Number(formData.get("status")),
      subcategory: escapeHtml(formData.get("subcategory")),
      title: escapeHtml(formData.get("title")),
    };

    const urls = formData.getAll("url");
    const sources = formData.getAll("source");

    for (let i = 0; i < urls.length; i++) {
      newProductData.images.push({
        url: urls[i],
        source: sources[i],
      });
    }

    await this.createNewProduct(newProductData);

    this.element.dispatchEvent(new CustomEvent("product-saved", {}));
  }

  handleClickRemoveImage = (event) => {
    if (event.target.closest("button")) {
      const currentUrl = event.target.closest("li").children[0].value;
      this.productData.images = this.productData.images.filter(({ url }) => {
        return currentUrl !== url;
      });
      this.updateImageList();
    }
  }

  handleClickLoadNewImage = async () => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Images",
          accept: {
            "image/*": [".png", ".gif", ".jpeg", ".jpg"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    });
    const file = await fileHandle.getFile();

    const formdata = new FormData();
    formdata.append("image", file);

    const response = await this.addNewImage(formdata);

    this.productData.images.push({
      source: file.name,
      url: response.data.link,
    });
    this.updateImageList();
  }

  handleClickSumbit = (event) => {
    event.preventDefault();
    if (this.mode === "add") {
      this.add();
    } else {
      this.save();
    }
  }

  addEvents = () => {
    this.subElements.imageListContainer.addEventListener("click", this.handleClickRemoveImage);

    const formElement = this.subElements.productForm.elements;
    formElement["uploadImage"].addEventListener("click", this.handleClickLoadNewImage);

    this.subElements.productForm.addEventListener("submit", this.handleClickSumbit);
  };
}
