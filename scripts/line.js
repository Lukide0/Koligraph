class Line {
  constructor(startShape, endShape, svgEl) {
    this.start = startShape;
    this.end = endShape;
    this.svg = svgEl;
    this.lineEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.lineEl.setAttribute("stroke", "#FFF");
    this.lineEl.setAttribute("stroke-width", 1);

    this.svg.appendChild(this.lineEl);
    this.render();
  }

  render() {
    let containerRect = this.svg.parentNode.getBoundingClientRect();
    let startRect = this.start.element.getBoundingClientRect();
    let endRect = this.end.element.getBoundingClientRect();

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
