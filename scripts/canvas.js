const ACTION = {
  MOVE: "Move shape",
  LINE: "Create line",
};

class Canvas {
  constructor(element, svgElement) {
    this.element = element;
    this.svgEl = svgElement;
    this.boundRect = element.getBoundingClientRect();
    this.shapes = [];
    this._moveEl = null;
    this._selectedShape = null;
    this._mouseStart = { x: 0, y: 0 };
    this.state = ACTION.MOVE;

    this.svgEl.setAttribute(
      "viewBox",
      `0 0 ${this.boundRect.width} ${this.boundRect.height}`
    );

    this.svgEl.setAttribute("width", this.boundRect.width);
    this.svgEl.setAttribute("height", this.boundRect.height);

    this._initMove();
    this._initActions();
  }

  _initMove() {
    let that = this;

    function moveHelper(e) {
      if (that._moveEl !== null) {
        that._moveEvent(e, that._moveEl.shape, that._mouseStart);
      }
    }

    this.element.onmousedown = function (e) {
      if (that.state != ACTION.MOVE) {
        return;
      }

      that._moveEl = e.target.closest(".shape");

      if (that._moveEl !== null) {
        that._mouseStart = {
          x: e.clientX - that._moveEl.shape.pos.x,
          y: e.clientY - that._moveEl.shape.pos.y,
        };

        that._moveEl.style.userSelect = "none";
        that._moveEl.shape.focus();
        that.element.addEventListener("mousemove", moveHelper);
      }
    };

    this.element.onmouseup = (e) => {
      if (that._moveEl !== null) {
        that.element.removeEventListener("mousemove", moveHelper);
        that._moveEl.style.userSelect = "auto";
        that._moveEl.shape.blur();
        that._moveEl = null;
      }
    };
  }

  _initActions() {
    let that = this;
    this.element.ondblclick = function (e) {
      let x = e.clientX - canvas.boundRect.left;
      let y = e.clientY - canvas.boundRect.top;
      let shape = new Shape(x, y);

      that.addShape(shape);
    };

    this.element.onclick = function (e) {
      if (that.state != ACTION.LINE) {
        return;
      }

      let shapeEl = e.target.closest(".shape");
      if (shapeEl === null) {
        return;
      }

      // prevent movement action
      that._moveEl = null;

      // line start
      if (that._selectedShape === null) {
        that._selectedShape = shapeEl.shape;
        shapeEl.shape.focus();
      }
      // line end
      else {
        that.createLine(that._selectedShape, shapeEl.shape, that.svgEl);
        that._selectedShape.blur();
        that._selectedShape = null;
      }
    };
  }

  addShape(shape) {
    this.shapes.push(shape);
    this.element.appendChild(shape.element);
  }

  createLine(startShape, endShape, svg) {
    let line = new Line(startShape, endShape, svg);

    startShape.addLine(line);
    endShape.addLine(line);
  }

  _moveEvent(e, shape, mouseStart) {
    let x = e.clientX - mouseStart.x;
    let y = e.clientY - mouseStart.y;

    shape.lines.forEach((line) => line.render());

    shape.setPos(Math.max(x, 0), Math.max(y, 0));
  }
}
