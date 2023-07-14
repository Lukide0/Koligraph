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

class Canvas {
  constructor(element) {
    this.element = element;
    this.boundRect = element.getBoundingClientRect();
    this.viewPos = { x: 0, y: 0 };
    this.shapes = [];
    this._moveEl = null;
    this._mouseStart = { x: 0, y: 0 };

    this._initMove();
  }

  _initMove() {
    let that = this;

    function moveHelper(e) {
      that._moveEvent(e, that._moveEl.shape, that._mouseStart);
    }

    this.element.onmousedown = function (e) {
      that._moveEl = e.target.closest(".shape");

      if (that._moveEl !== null) {
        that._mouseStart = {
          x: e.clientX - that._moveEl.shape.pos.x,
          y: e.clientY - that._moveEl.shape.pos.y,
        };

        that._moveEl.style.userSelect = "none";
        that.element.addEventListener("mousemove", moveHelper);
      }
    };

    this.element.onmouseup = (e) => {
      if (that._moveEl !== null) {
        that.element.removeEventListener("mousemove", moveHelper);
        that._moveEl.style.userSelect = "auto";
        that._moveEl = null;
      }
    };
  }

  addShape(shape) {
    this.shapes.push(shape);
    this.element.appendChild(shape.element);
  }

  _moveEvent(e, shape, mouseStart) {
    let x = e.clientX - mouseStart.x;
    let y = e.clientY - mouseStart.y;

    shape.setPos(Math.max(x, 0), Math.max(y, 0));
  }
}

class Shape {
  constructor(x, y, shape = SHAPES.BOX) {
    this.pos = { x, y };
    this.shape = shape;

    this.element = document.createElement("div");
    this.element.classList.add("shape");
    this.element.shape = this;

    this.textElement = document.createElement("p");
    this.element.appendChild(this.textElement);

    this.setPos(x, y);

    let that = this;

    this.element.ondblclick = (e) => {
      that.textElement.contentEditable = true;
      that.textElement.focus();

      e.stopPropagation();
      e.preventDefault();
    };

    this.textElement.onblur = () => {
      that.textElement.contentEditable = false;
    };

    switch (shape) {
      case SHAPES.BOX_ROUND_EDGES:
        this.element.classList.add("round");
        break;
      case SHAPES.STADIUM:
        this.element.classList.add("statium");
        break;
      case SHAPES.CIRCLE:
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

  inView(startX, startY, endX, endY) {
    return (
      this.pos.x >= startX &&
      this.pos.x < endX &&
      this.pos.y >= startY &&
      this.pos.y < this.pos.y
    );
  }

  setPos(x, y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.pos.x = x;
    this.pos.y = y;
  }
}
