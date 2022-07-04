class Tooltip {
  currentBlock = null
  static #onlyInstance = null;

  constructor() {
    if (!Tooltip.#onlyInstance) {
      Tooltip.#onlyInstance = this;
    } else {
      return Tooltip.#onlyInstance;
    }
  }

  handleMouseIn = (event) => {
    const tooltipBlock = event.target.closest("[data-tooltip]");

    this.currentBlock = tooltipBlock;
    this.render(this.currentBlock.dataset.tooltip);

    this.currentBlock.addEventListener("mousemove", this.handleMouseMove);
    this.currentBlock.addEventListener("pointerout", this.handleMouseLeave);
  };

  handleMouseMove = (event) => {
    this.element.style.left = (event.pageX + this.element.offsetWidth / 2) + "px";
    this.element.style.top = (event.pageY + this.element.offsetHeight / 2) + 'px';
  };

  handleMouseLeave = (event) => {
    this.currentBlock.removeEventListener("mousemove", this.handleMouseMove);
    this.currentBlock.removeEventListener("pointerout", this.handleMouseLeave);
    this.element.remove();
    this.currentBlock = null;
  };

  initialize() {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    this.element = tooltip;

    document.addEventListener("pointerover", this.handleMouseIn);
  }

  render(text = '') {
    this.element.innerHTML = text;
    document.body.appendChild(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener("pointerover", this.handleMouseIn);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
