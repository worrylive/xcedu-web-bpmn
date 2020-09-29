export function arrayToStrWithOutComma (arr, attr) {
  let str = ''
  if (attr) {
    for (const i of arr) {
      str += i[attr] + ','
    }
  } else {
    for (const i of arr) {
      str += i + ','
    }
  }
  return str.substring(0, str.lastIndexOf(','))
}
