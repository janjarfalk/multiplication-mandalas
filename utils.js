export const createNode = (n, v) => {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
      return "-" + m.toLowerCase();
    }), v[p]);
  return n
};

export const downloadContent = (filename, content) => {
  const blob = new Blob([content]);
  const event = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  const a = document.createElement("a");
  a.download = filename;
  a.href = URL.createObjectURL(blob);
  a.dispatchEvent(event);
};

export const emptyElement = element => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  return element;
};