function convertMovieStarsToArray(stars) {
  const starNum = parseInt(stars/10);
  const arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push(i<starNum);
  }
  console.log(arr);
  return arr;
}

module.exports = {
  convertMovieStarsToArray
}