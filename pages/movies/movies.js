var app = getApp();
const utils = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheatersMovies: {},
    comingSoonMovies: {},
    top250Movies: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 正在热映
    const inTheatersUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/in_theaters?start=0&count=3`;
    // 即将上映
    const comingSoonUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/coming_soon?start=0&count=3`;
    // top250
    const top250Url = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/top250?start=0&count=3`;
    
    this.getMoviesList(inTheatersUrl, 'inTheatersMovies', '正在热映');
    this.getMoviesList(comingSoonUrl, 'comingSoonMovies', '即将上映');
    this.getMoviesList(top250Url, 'top250Movies', 'top250');

  },
  // 获取电影列表
  getMoviesList(url, movieCategory, categoryName){
    wx.request({
      url,
      method: 'GET',
      data: {},
      header: {
        // 这里必须填写为 json， 不能填写 application/json
        "Content-Type": "json"  
      },
      success: (res) => {
        const temp = {};
        const arr = res.data.subjects.map((item) => {
          return {
            id: item.id,  // 电影id
            title: item.title,  //电影名 
            rating: { 
              average: item.rating.average, // 评分
              stars: item.rating.stars, // 星
              starsArray: utils.convertMovieStarsToArray(item.rating.stars)
            },
            image: item.images.large // 海报
          };
        });
        temp[movieCategory] = {
          movies: arr,
          categoryName

        };
        this.setData(temp);
      },
      fail: function (res) {
        console.log(res)
      }

    })
  }
})