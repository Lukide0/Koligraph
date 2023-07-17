class Menu {
  constructor(menuEl) {
    this.element = menuEl;
  }

  move(x, y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  close() {
    this.element.classList.remove("open");
  }

  open() {
    this.element.classList.add("open");
  }
}
