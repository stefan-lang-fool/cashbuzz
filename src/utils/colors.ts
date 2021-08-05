/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-bitwise */

export const RGBToHex = (rgb: string): string => {
  // Choose correct separator
  const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // Turn "rgb(r,g,b)" into [r,g,b]
  const rgbArray = rgb.substr(4).split(')')[0].split(sep);

  let r = (+rgbArray[0]).toString(16);
  let g = (+rgbArray[1]).toString(16);
  let b = (+rgbArray[2]).toString(16);

  if (r.length === 1) { r = `0${r}`; }
  if (g.length === 1) { g = `0${g}`; }
  if (b.length === 1) { b = `0${b}`; }

  return `#${r}${g}${b}`;
};

export const LightenColor = (color: string, percent: number): string => {
  let inputColor = color;

  if (!color.length) {
    return '#e1e1e1';
  }

  if (color[0] !== '#') {
    inputColor = RGBToHex(color);
  }

  return `${inputColor}${Math.floor(percent / 100 * 255).toString(16)
    .padStart(2, '0')}`;
};
