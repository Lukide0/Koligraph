const Log = {
  _currTimeAsStr() {
    let d = new Date().toISOString();

    return d
      .substring(0, d.length - 1)
      .split("T")
      .join(" ");
  },

  success(msg) {
    console.log(`%cSUCCESS (${this._currTimeAsStr()}):`, "color: #1faa00", msg);
  },
  info(msg) {
    console.info(`%cINFO (${this._currTimeAsStr()}):`, "color: #1976D2", msg);
  },
  warn(msg) {
    console.warn(
      `%cWARNING (${this._currTimeAsStr()}):`,
      "color: #FFA000",
      msg
    );
  },
  err(msg) {
    console.error(`%cERROR (${this._currTimeAsStr()}):`, "color: #D32F2F", msg);
  },
};

function fatalErr(msg) {
  Log.err(msg);
  throw new Error("Fatal error");
}

function $(select) {
  return document.querySelector(select);
}

function createOpts(selectEl, obj) {
  for (let [key, value] of Object.entries(obj)) {
    let opt = document.createElement("option");
    opt.setAttribute("value", key);
    opt.text = value;

    selectEl.appendChild(opt);
  }
}

function getKey(value, obj) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

const previewEl = $("#preview");
const canvas = new Canvas($("#canvas"), $("#background"));

const shapeMenu = new Menu($("#shapeMenu"));
const lineMenu = new Menu($("#lineMenu"));
const actionEl = $("#action");

let selected = null;
let shapeSelect = $("#shapeSelect");
let lineStyleSelect = $("#lineStyle");
let lineStartHeadSelect = $("#lineStartHead");
let lineEndHeadSelect = $("#lineEndHead");

createOpts(actionEl, ACTION);
createOpts(shapeSelect, SHAPES);
createOpts(lineStyleSelect, LINE_STYLE);
createOpts(lineStartHeadSelect, LINE_HEAD);
createOpts(lineEndHeadSelect, LINE_HEAD);

actionEl.onchange = function () {
  canvas.setState(ACTION[actionEl.value]);
};

canvas.setContextMenuFn(contextMenu);

function contextMenu(shapeOrLine, id, e) {
  let x = e.clientX - canvas.boundRect.x;
  let y = e.clientY - canvas.boundRect.y;

  if (selected !== null) {
    selected.blur();
  }

  selected = shapeOrLine;
  shapeOrLine.focus();

  if (id == "shape") {
    let shape = shapeOrLine;

    shapeMenu.open();
    shapeMenu.move(x, y);

    shapeSelect.value = getKey(shape.shape, SHAPES);
  } else if (id == "line") {
    let line = shapeOrLine;

    lineMenu.open();
    lineMenu.move(x, y);

    lineStyleSelect.value = getKey(line.style, LINE_STYLE);
    lineStartHeadSelect.value = getKey(line.startHead, LINE_HEAD);
    lineEndHeadSelect.value = getKey(line.endHead, LINE_HEAD);
  }
}

// hide context menus
document.onclick = function (e) {
  if (!shapeMenu.element.contains(e.target)) {
    shapeMenu.close();
  }

  if (!lineMenu.element.contains(e.target)) {
    lineMenu.close();
  }

  if (selected !== null) {
    selected.blur();
  }
};

shapeSelect.onchange = function () {
  selected.setShape(SHAPES[shapeSelect.value]);
};

lineStyleSelect.onchange = function () {
  selected.setStyle(LINE_STYLE[lineStyleSelect.value]);
};

lineStartHeadSelect.onchange = function () {
  selected.setStartHead(LINE_HEAD[lineStartHeadSelect.value]);
};

lineEndHeadSelect.onchange = function () {
  selected.setEndHead(LINE_HEAD[lineEndHeadSelect.value]);
};
