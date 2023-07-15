const SHAPES = {
  BOX: "BOX",
  BOX_ROUND_EDGES: "BOX_ROUND_EDGES",
  STADIUM: "STADIUM",
  DATABASE: "DATABASE",
  CIRCLE: "CIRCLE",
  DOUBLE_CIRCLE: "DOUBLE_CIRCLE",
  FLAG: "FLAG",
  RHOMBUS: "RHOMBUS",
  HEXAGON: "HEXAGON",
  PARALLELOGRAM: "PARALLELOGRAM",
  PARALLELOGRAM_ALT: "PARALLELOGRAM_ALT",
  TRAPEZOID: "TRAPEZOID",
  TRAPEZOID_ALT: "TRAPEZOID_ALT",
};

class Shape {
  constructor(x, y, shape = SHAPES.BOX) {
    this.pos = { x, y };
    this.shape = shape;

    this.element = document.createElement("div");
    this.element.shape = this;
    this.lines = new Set();

    this.textElement = document.createElement("p");
    this.element.appendChild(this.textElement);

    this.setPos(x, y);
    this.setShape(shape);

    let that = this;

    this.element.ondblclick = (e) => {
      that.textElement.contentEditable = true;
      that.textElement.focus();

      e.stopPropagation();
      e.preventDefault();
    };

    this.textElement.onblur = () => {
      that.textElement.contentEditable = false;
      that.lines.forEach((line) => line.render());
    };
  }

  setShape(shape) {
    this.element.className = "shape";
    switch (shape) {
      case SHAPES.BOX_ROUND_EDGES:
        this.element.classList.add("round");
        break;
      case SHAPES.STADIUM:
        this.element.classList.add("stadium");
        break;
      case SHAPES.CIRCLE:
        this.element.classList.add("circle");
        break;
      case SHAPES.DATABASE:
      case SHAPES.DOUBLE_CIRCLE:
      case SHAPES.FLAG:
      case SHAPES.RHOMBUS:
      case SHAPES.HEXAGON:
      case SHAPES.PARALLELOGRAM:
      case SHAPES.PARALLELOGRAM_ALT:
      case SHAPES.TRAPEZOID:
      case SHAPES.TRAPEZOID_ALT:
      default:
        break;
    }
  }

  addLine(line) {
    this.lines.add(line);
  }

  removeLine(line) {
    this.lines.delete(line);
  }

  setPos(x, y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.pos.x = x;
    this.pos.y = y;
  }
}
