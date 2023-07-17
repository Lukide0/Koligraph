const SHAPES = {
  BOX: "Box",
  BOX_ROUND_EDGES: "Box with round edges",
  STADIUM: "Stadium",
  DATABASE: "Database",
  CIRCLE: "Circle",
  DOUBLE_CIRCLE: "Double circle",
  FLAG: "Flag",
  RHOMBUS: "Rhombus",
  HEXAGON: "Hexagon",
  PARALLELOGRAM: "Parallelogram",
  PARALLELOGRAM_ALT: "Parallelogram alt.",
  TRAPEZOID: "Trapezoid",
  TRAPEZOID_ALT: "Trapezoid alt.",
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
    this.shape = shape;
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

  remove() {
    for (let line of this.lines) {
      line.remove();
    }

    this.element.remove();
  }

  focus() {
    this.element.classList.add("selected");
  }

  blur() {
    this.element.classList.remove("selected");
  }

  setPos(x, y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.pos.x = x;
    this.pos.y = y;
  }

  toMermaid() {
    let pair = ["[", "]"];

    switch (this.shape) {
      case SHAPES.BOX_ROUND_EDGES:
        pair = ["(", ")"];
        break;
      case SHAPES.STADIUM:
        pair = ["([", "])"];
        break;
      case SHAPES.CIRCLE:
        pair = ["((", "))"];
        break;
      case SHAPES.DATABASE:
        pair = ["[(", ")]"];
        break;
      case SHAPES.DOUBLE_CIRCLE:
        pair = ["(((", ")))"];
        break;
      case SHAPES.FLAG:
        pair = [">", "]"];
        break;
      case SHAPES.RHOMBUS:
        pair = ["{", "}"];
        break;
      case SHAPES.HEXAGON:
        pair = ["{{", "}}"];
        break;
      case SHAPES.PARALLELOGRAM:
        pair = ["[/", "/]"];
        break;
      case SHAPES.PARALLELOGRAM_ALT:
        pair = ["[\\", "\\]"];
        break;
      case SHAPES.TRAPEZOID:
        pair = ["[/", "\\]"];
        break;
      case SHAPES.TRAPEZOID_ALT:
        pair = ["[\\", "/]"];
        break;
      default:
        break;
    }

    let content = this.textElement.innerHTML.replaceAll("<br>", "\n");
    if (content == "") {
      content = " ";
    }

    return `${pair[0]}\"${content}\"${pair[1]}`;
  }
}
