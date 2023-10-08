export const colors = ['#d11141', '#00b159', '#00aedb', '#f37735', '#cccccc', '#ffc425', '#8c8c8c'];

export function adjustHexOpacity(colorIndex, opacity) {
  const colorIndexMod = colorIndex % colors.length;

  const r = parseInt(colors[colorIndexMod].slice(1, 3), 16);
  const g = parseInt(colors[colorIndexMod].slice(3, 5), 16);
  const b = parseInt(colors[colorIndexMod].slice(5, 7), 16);

  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
}