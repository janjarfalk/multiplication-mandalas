export const getNode = (n, v) => {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
            return "-" + m.toLowerCase();
        }), v[p]);
    return n
};
