import {getNode} from './lib.js';

document.querySelectorAll('.js-syncvalue').forEach(element => {
    const display = (element.querySelectorAll('.js-value') || [])[0];
    const input = (element.querySelectorAll('input') || [])[0];
    display.innerHTML = input.value;
    input.addEventListener('change', event => display.innerHTML = event.target.value);
});

const SIZE = 100;

const svg = getNode("svg");
svg.setAttribute("viewBox", `0, 0, 200, 200`);

const line = getNode("line", {
    x1: 0,
    y1: 0,
    x2: 100,
    y2: 100,
    strokeWidth: 0.2,
    stroke: "#FFFFFF"
});

svg.appendChild(line);

document.getElementById('js-paper').appendChild(svg);
