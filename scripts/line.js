const LINE_STYLE = {
  NORMAL: "Normal",
  THICK: "Thick",
  DOTTED: "Dotted",
};

const LINE_HEAD = {
  NONE: "None",
  ARROW: "Arrow",
  DOT: "Dot",
  CROSS: "Cross",
};

const LINE_HEAD_SIZE = 20;

class Line {
  constructor(startShape, endShape, svgEl) {
    this.start = startShape;
    this.end = endShape;
    this.svg = svgEl;
    this.style = LINE_STYLE.NORMAL;
    this.startHead = LINE_HEAD.NONE;
    this.endHead = LINE_HEAD.NONE;

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

  setStyle(style) {
    this.style = style;
    switch (style) {
      case LINE_STYLE.THICK:
        this.lineEl.dataset.style = "thick";
        break;
      case LINE_STYLE.DOTTED:
        this.lineEl.dataset.style = "dotted";
        //coordinates from the centre of the shapes
        break;
      default:
        this.lineEl.dataset.style = "normal";
        break;
    }
  }

  setStartHead(head) {
    this.startHead = head;
    let value = "";
    switch (head) {
      case LINE_HEAD.ARROW:
        value = "url(#arrow)";
        break;
      case LINE_HEAD.DOT:
        value = "url(#dot)";
        break;
      case LINE_HEAD.CROSS:
        value = "url(#cross)";
        break;
      default:
        break;
    }

    this.lineEl.setAttribute("marker-start", value);
    this.render();
  }
  setEndHead(head) {
    this.endHead = head;
    let value = "";
    switch (head) {
      case LINE_HEAD.ARROW:
        value = "url(#arrow)";
        break;
      case LINE_HEAD.DOT:
        value = "url(#dot)";
        break;
      case LINE_HEAD.CROSS:
        value = "url(#cross)";
        break;
      default:
        break;
    }

    this.lineEl.setAttribute("marker-end", value);
    this.render();
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

    // direction
    let vec = { x: endRect.x - startRect.x, y: endRect.y - startRect.y };

    // vector length
    let len = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));

    // norm
    vec.x /= len;
    vec.y /= len;

    let vecInverse = { x: -vec.x, y: -vec.y };

    const findIntersection = (width, height, vector, lineHead) => {
      let xWidth = Math.abs(width / (vector.x * 2));
      let xHeight = Math.abs(height / (vector.y * 2));

      let alpha = Math.min(xWidth, xHeight);

      // gap for line marker
      let gap = (lineHead != LINE_HEAD.NONE) * LINE_HEAD_SIZE;
      alpha += gap;

      //coordinates from the centre of the shape
      let coord = { x: vector.x * alpha, y: vector.y * alpha };
      coord.x += width / 2;
      coord.y += height / 2;
      return coord;
    };

    let startRectInt = findIntersection(
      startRect.width,
      startRect.height,
      vec,
      this.startHead
    );
    let endRectInt = findIntersection(
      endRect.width,
      endRect.height,
      vecInverse,
      this.endHead
    );

    let startCoord = {
      x: startRectInt.x + startRect.x - containerRect.x,
      y: startRectInt.y + startRect.y - containerRect.y,
    };
    let endCoord = {
      x: endRectInt.x + endRect.x - containerRect.x,
      y: endRectInt.y + endRect.y - containerRect.y,
    };

    this.lineEl.setAttribute(
      "d",
      `M ${startCoord.x} ${startCoord.y} L ${endCoord.x} ${endCoord.y}`
    );
  }
}
