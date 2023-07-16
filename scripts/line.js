class Line {
  constructor(startShape, endShape, svgEl) {
    this.start = startShape;
    this.end = endShape;
    this.svg = svgEl;
    this.lineEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.lineEl.classList.add("path");
    this.lineEl.line = this;

    this.svg.appendChild(this.lineEl);
    this.render();
  }

  remove() {
    this.start.removeLine(this);
    this.end.removeLine(this);

    this.lineEl.remove();
  }

  focus() {
    this.lineEl.classList.add("selected");
  }

  blur() {
    this.lineEl.classList.remove("selected");
  }

  render() {
    let containerRect = this.svg.parentNode.getBoundingClientRect();
    let startRect = this.start.element.getBoundingClientRect();
    let endRect = this.end.element.getBoundingClientRect();

    // centers of shapes
    let startXY = {
      x: startRect.width / 2 + startRect.x - containerRect.x,
      y: startRect.height / 2 + startRect.y - containerRect.y,
    };
    let endXY = {
      x: endRect.width / 2 + endRect.x - containerRect.x,
      y: endRect.height / 2 + endRect.y - containerRect.y,
    };

    this.lineEl.setAttribute(
      "d",
      `M ${startXY.x} ${startXY.y} L ${endXY.x} ${endXY.y}`
    );
  }
}
