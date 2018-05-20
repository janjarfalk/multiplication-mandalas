import {
  createNode,
  downloadContent,
  emptyElement,
  getQueryStringObjectFromHash,
  serializeObject
} from './utils.js';

import {controls} from "./gui.js";


const setAttributes = (element, attributes) => Object.entries(attributes)
    .forEach(([key, val]) =>
        element.setAttribute(key, val));

const elements = controls.map(control => {
  const label = document.createElement('label');
  const text = document.createTextNode(control.id);
  const input = document.createElement('input');

  setAttributes(input, control);

  const val = document.createElement('span');
  val.innerHTML = ` (${control.value})`;

  label.appendChild(text);
  label.appendChild(val);
  label.appendChild(input);

  input.addEventListener('change', event => {
    val.innerHTML = ` (${event.target.value})`;
    const options = Array.from(document.querySelectorAll('input'))
        .map(({id, value}) => ({[id]: value}))
        .reduce((memo, item) => Object.assign(memo, item), {});
    location.hash = serializeObject(options);
  });

  return label;
});

const target = document.getElementById('controls');
elements.forEach(element => target.appendChild(element));

// const search = window.location.search;
const params = getQueryStringObjectFromHash();
Object.keys(params).forEach(key => {
  const input = document.getElementById(key);
  if (input) {
    input.value = params[key];
  }
});

const svg = createNode("svg");
document.getElementById('js-paper').appendChild(svg);

window.addEventListener("hashchange", event => {
  const options = getQueryStringObjectFromHash();
  render({svg, ...options});
  Object.keys(options).forEach(key => {
    const input = document.getElementById(key);
    if (input) {
      input.value = options[key];
    }
  });
});

const options = Array.from(document.querySelectorAll('input'))
    .map(({id, value}) => ({[id]: value}))
    .reduce((memo, item) => Object.assign(memo, item), {});
render({svg, ...options});


const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', event => {
  const options = Array.from(document.querySelectorAll('input'))
      .map(({id, value}) => ({[id]: value}))
      .reduce((memo, item) => Object.assign(memo, item), {});
  render({svg, ...options});
  const values = Object.values(options).join('-');
  downloadContent(`mandala-${values}.svg`, svg.outerHTML);
});

function render(options) {

  const {svg} = options;

  const size = 1000;
  const table = parseInt(options.table);
  const modulo = parseInt(options.modulo);
  const rotation = parseInt(options.rotation);
  const start = parseInt((options.start || 0) / 100 * modulo);
  const end = parseInt((options.end || 100) / 100 * modulo);

  const width = size;
  const height = size;

  emptyElement(svg);
  svg.setAttribute("viewBox", `0, 0, ${size}, ${size}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);


  // Create an array of circle coordinates.
  const circle = new Array(modulo).fill(0).map((_, index) => index * (Math.PI * 2) / modulo).map(angle => {
    const x = width / 2 * Math.cos(angle + (Math.PI / 180 * rotation)) + width / 2;
    const y = height / 2 * Math.sin(angle + (Math.PI / 180 * rotation)) + height / 2;
    return {x, y};
  });

  // Create the lines.
  const lines = new Array(end - start).fill(0).map((_, index) => start + index).map(i => {
    const p1 = parseInt(i % modulo, 10);
    const p2 = parseInt((table * i) % modulo, 10);

    const start = circle[p1];
    const end = circle[p2];

    const {x: x1, y: y1} = start;
    const {x: x2, y: y2} = end;

    if (options.center === "1") {
      const w = Math.abs(x1 - x2);
      const h = Math.abs(y1 - y2);

      const x = x1 < x2 ? x1 : x2;
      const y = y1 < y2 ? y1 : y2;
      const diffx = size / 2 - x;
      const diffy = size / 2 - y;

      const res = {
        x1: x1 + diffx - w / 2,
        x2: x2 + diffx - w / 2,
        y1: y1 + diffy - h / 2,
        y2: y2 + diffy - h / 2
      };

      return res;
    }

    return {x1, y1, x2, y2};
  });

  const filteredLines = lines.filter((_, index) => {
    return index % parseInt(options.keepEveryNLines) === parseInt(options.keepEveryNLinesShift);
  });

  const filteredLines2 = parseInt(options.minLength) === 0 ? filteredLines : filteredLines.filter(line => {
    const a = line.x1 - line.x2;
    const b = line.y1 - line.y2;
    const length = Math.sqrt(a * a + b * b);
    return length > options.minLength
  });


  // Append lines to svg element.
  filteredLines2.forEach(coordinates => {
    const line = createNode("line", {
      strokeWidth: 0.4,
      stroke: "#FFFFFF", ...coordinates
    });
    svg.appendChild(line);
  });

}