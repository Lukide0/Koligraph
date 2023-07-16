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

const previewEl = $("#preview");
const canvas = new Canvas($("#canvas"), $("#background"));

const actionEl = $("#action");

// generate options
for (const [key, value] of Object.entries(ACTION)) {
  let opt = document.createElement("option");
  opt.setAttribute("value", key);
  opt.text = value;

  actionEl.appendChild(opt);
}

actionEl.onchange = function () {
  canvas.setState(ACTION[actionEl.value]);
};
