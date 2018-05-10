import {createNode, downloadContent, emptyElement, getQueryStringObject, getQueryStringObjectFromHash, serializeObject} from './utils.js';

// const search = window.location.search;
const params = getQueryStringObjectFromHash();
Object.keys(params).forEach(key => {
  const input = document.getElementById(key);
  if (input) {
    input.value = params[key];
  }
});

document.querySelectorAll('.js-syncvalue').forEach(element => {
  const display = (element.querySelectorAll('.js-value') || [])[0];
  const input = (element.querySelectorAll('input') || [])[0];
  display.innerHTML = input.value;
  input.addEventListener('change', event => display.innerHTML = event.target.value);
});


const svg = createNode("svg");
document.getElementById('js-paper').appendChild(svg);

document.querySelectorAll('input').forEach(element => {
  element.addEventListener('change', _ => {
    const options = Array.from(document.querySelectorAll('input'))
        .map(({name, value}) => ({[name]: value}))
        .reduce((memo, item) => Object.assign(memo, item), {});
    location.hash = serializeObject(options);
  });
});

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
    .map(({name, value}) => ({[name]: value}))
    .reduce((memo, item) => Object.assign(memo, item), {});
render({svg, ...options});


const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', event => {
  const values = Object.values(options).join('-');
  downloadContent(`mandala-${values}.svg`, svg.outerHTML);
});

function render(options) {

  const {svg} = options;

  const size = 1000;
  const table = parseInt(options.table);
  const modulo = parseInt(options.modulo);
  const rotation = parseInt(options.rotation);
  const start = parseInt(options.start);
  const end = parseInt(options.end) || modulo;

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

  // svg.setAttribute("viewbox", `0 0 ${width} ${height}`);
  // svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  // svg.setAttribute('name', name);

  // Append the empty SVG to viewport element.
  // viewportElement.appendChild(svg);

  // Create the lines.
  const lines = new Array(end - start).fill(0).map((_, index) => start + index).map(i => {
    const p1 = parseInt(i % modulo, 10);
    const p2 = parseInt((table * i) % modulo, 10);

    const start = circle[p1];
    const end = circle[p2];

    const {x: x1, y: y1} = start;
    const {x: x2, y: y2} = end;

    return {x1, y1, x2, y2};
  });

  // Append lines to svg element.
  lines.forEach(coordinates => {
    const line = createNode("line", {
      strokeWidth: 0.4,
      stroke: "#FFFFFF", ...coordinates
    });
    svg.appendChild(line);
  });
}

// render({svg});