function convertMovieStarsToArray(stars) {
  const starNum = parseInt(stars/10);
  const arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push(i<starNum);
  }
  return arr;
}

// 获取电影列表
function http(url, successCallback, errorCallback){
  wx.request({
    url,
    method: 'GET',
    data: {},
    header: {
      // 这里必须填写为 json， 不能填写 application/json
      "Content-Type": "json"
    },
    success: (res) => {
      successCallback(res.data);

    },
    fail: (error) => {
      errorCallback(error);
    },
    complete: () => {
    }
  })
}

module.exports = {
  convertMovieStarsToArray,
  http
}