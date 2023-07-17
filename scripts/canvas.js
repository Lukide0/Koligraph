const ACTION = {
  MOVE: "Move shape",
  LINE: "Create line",
  DELETE: "Delete",
};

class Canvas {
  constructor(element, svgElement) {
    this.element = element;
    this.svgEl = svgElement;
    this.boundRect = element.getBoundingClientRect();
    this.shapes = new Set();
    this._contextFn = null;
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

    this.element.oncontextmenu = function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (that._contextFn === null) {
        return;
      }

      if (e.target.nodeName == "path") {
        that._contextFn(e.target.line, "line", e);
      } else {
        let shapeEl = e.target.closest(".shape");

        if (shapeEl !== null) {
          that._contextFn(shapeEl.shape, "shape", e);
        }
      }
    };

    this.element.onmousedown = function (e) {
      const LEFT_CLICK = 1;

      if (that.state != ACTION.MOVE || e.which != LEFT_CLICK) {
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
      switch (that.state) {
        case ACTION.LINE:
          break;
        case ACTION.DELETE:
          that._deleteShapeLine(e, that);
          return;
        default:
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

  setContextMenuFn(fn) {
    this._contextFn = fn;
  }

  setState(action) {
    this.state = action;

    // reset
    if (this._selectedShape !== null) {
      this._selectedShape.blur();
    }

    if (this._moveEl !== null) {
      this._moveEl.shape.blur();
    }

    this._selectedShape = null;
    this._moveEl = null;
  }

  addShape(shape) {
    this.shapes.add(shape);
    this.element.appendChild(shape.element);
  }

  removeShape(shape) {
    this.shapes.delete(shape);
  }

  createLine(startShape, endShape, svg) {
    // line already exists
    for (let line of startShape.lines) {
      if (line.start == endShape || line.end == endShape) {
        return;
      }
    }

    // the line has no target
    if (startShape == endShape) {
      return;
    }

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

  _deleteShapeLine(e, canvas) {
    let name = e.target.nodeName;

    // shape
    if (name != "path") {
      let shapeEl = e.target.closest(".shape");
      if (shapeEl === null) {
        return;
      }

      if (canvas._selectedShape != shapeEl.shape) {
        // selected different shape
        if (canvas._selectedShape !== null) {
          canvas._selectedShape.blur();
        }

        canvas._selectedShape = shapeEl.shape;
        shapeEl.shape.focus();
        return;
      }

      canvas._selectedShape = null;

      canvas.removeShape(shapeEl.shape);
      shapeEl.shape.remove();
    }
    // line
    else {
      let line = e.target.line;

      if (canvas._selectedShape != line) {
        // selected different line
        if (canvas._selectedShape !== null) {
          canvas._selectedShape.blur();
        }
        canvas._selectedShape = line;
        line.focus();

        return;
      }
      line.remove();
    }
  }

  exportAsMermaid() {
    let shapes = [...this.shapes].sort((a, b) => {
      if (a.pos.y < b.pos.y) {
        return -1;
      } else if (a.pos.y == b.pos.y && a.pos.x < b.pos.x) {
        return -1;
      } else return a.pos.x != b.pos.x || a.pos.y != b.pos.y;
    });

    let used = new Set();

    let code = ["graph TD"];

    for (let i = 0; i < shapes.length; i++) {
      let shape = shapes[i];
      if (used.has(shape)) {
        continue;
      }

      let tmpCode = [`id_${i}${shape.toMermaid()}`];

      let lines = [...shape.lines]
        .filter((line) => line.start === shape)
        .forEach((line) => {
          let other = line.end;
          let otherId = shapes.indexOf(other);

          tmpCode.push(`id_${i}`);
          tmpCode.push(line.toMermaid());

          if (!used.has(other)) {
            tmpCode.push(`id_${otherId}${other.toMermaid()}`);
            used.add(other);
          } else {
            tmpCode.push(`id_${otherId}`);
          }

          tmpCode.push("\n\t");
        });

      code.push(tmpCode.join(" "));
      used.add(shape);
    }
    return code.join("\n\t");
  }
}
