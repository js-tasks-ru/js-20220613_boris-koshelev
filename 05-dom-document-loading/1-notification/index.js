const MS_TO_SEC = 1000;
const DELAY = 100;
const DEFAULT_DURATION = 200;

export default class NotificationMessage {
  static isAlreadyRunning = false;
  static currentInstance = null;

  constructor(
    text = "",
    { type = "success", duration = DEFAULT_DURATION } = {}
  ) {
    this.type = type;
    this.duration = duration;
    this.text = text;

    this.render();
  }

  get template() {
    const durationInSecond = this.duration / MS_TO_SEC;
    return /* HTML */ ` <div
      class="notification ${this.type}"
      style="--value:${durationInSecond}s"
    >
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">${this.text}</div>
      </div>
    </div>`;
  }

  show(renderElement = null) {
    if (NotificationMessage.isAlreadyRunning) {
      clearTimeout(NotificationMessage.currentInstance.timeoutRunner);
      NotificationMessage.currentInstance.remove();
      NotificationMessage.isAlreadyRunning = false;
    }

    if (renderElement) {
      this.element = renderElement;
    }

    NotificationMessage.currentInstance = this;
    this.element.removeAttribute("hidden");
    NotificationMessage.isAlreadyRunning = true;

    this.timeoutRunner = setTimeout(() => {
      this.remove();
      NotificationMessage.isAlreadyRunning = false;
    }, this.duration - DELAY);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  render() {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = this.template;
    this.element = tempElement.firstElementChild;
  }
}
