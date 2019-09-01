const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const colors = ['M', 'Y', 'S', 'K'];
const getAllTiles = () => {
  const allTiles = [[0, 'S'], [0, 'S']];
  for (let index = 0; index < colors.length; index++) {
    const color = colors[index];
    for (let index2 = 0; index2 < numbers.length; index2++) {
      const number = numbers[index2];
      allTiles.push([number, color]);
      allTiles.push([number, color]);
    }
  }

  return allTiles;
}
const isJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
module.exports = {
  numbers,
  colors,
  getAllTiles,
  isJSON
}