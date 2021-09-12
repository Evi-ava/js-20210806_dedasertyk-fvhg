export default class Tooltip {

  static singleton = null;
  element = null;

  constructor() {
    if(Tooltip.singleton !== null) {
      return Tooltip.singleton;
    }

    Tooltip.singleton = this;
  }

  render(text = '') {
    this.element = document.createElement('div');
    this.element.classList.add('tooltip');
    this.element.innerHTML = text;

    document.body.append(this.element);
  }

  initialize() {
    this.initHandlers();
  }

  initHandlers = () => {
    document.addEventListener('pointerover', this.pointerIn);
    document.addEventListener('pointerout', this.pointerOut);
  }

  pointerIn = event => {
    const elem = event.target.closest('[data-tooltip]');

    if(elem) {
      this.render(elem.dataset.tooltip);
      document.addEventListener('pointermove', this.pointerMove);
    }
  }

  pointerMove = event => {
    const offset = 10;

    this.element.style.left = event.clientX + offset + 'px';
    this.element.style.top = event.clientY + offset + 'px';
  }

  pointerOut = event => {
    this.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.pointerIn);
    document.removeEventListener('pointermove', this.pointerMove);
    document.removeEventListener('pointerOut', this.pointerOut);
  }

  remove() {
    if(this.element) {
      this.element.remove();
      this.element = null;
    }
  }

}
