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

export const getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return undefined;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const getQueryStringObject = () => {
  return window.location.search.substring(1).split('&')
      .map(str => {
        let [key, value] = str.split('=');
        return {[key]: decodeURI(value)};
      })
      .reduce((prev, curr) => Object.assign(prev, curr));
};

export const getQueryStringObjectFromHash = () => {
  return window.location.hash.substring(1).split('&')
      .map(str => {
        let [key, value] = str.split('=');
        return {[key]: decodeURI(value)};
      })
      .reduce((prev, curr) => Object.assign(prev, curr));
};


export const serializeObject = obj => `#${Object.keys(obj).map(k=>`${k}=${obj[k]}`).join('&')}`;
