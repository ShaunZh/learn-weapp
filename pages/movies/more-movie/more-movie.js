// pages/movies/more-movie/more-movie.js
const app = getApp();
const utils = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '',
    moviesListData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const category = options.category;
    let dataUrl = '';
    this.data.navigateTitle = category;
    switch (category) {
      case '正在热映': 
        dataUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/in_theaters`;
      break;
      case '即将上映':
        dataUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/coming_soon`; 
      break;
      case '豆瓣Top250': 
        // top250
        dataUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/top250`;
      break;
      default: break;
    }
    dataUrl.length && utils.http(dataUrl, this.processDoubanData, this.getMoviesListDataErrorDeal);
  },
  // 处理从豆瓣获取的数据
  processDoubanData: function (moviesList) {
    console.log(moviesList);
    const arr = moviesList.subjects.map((item) => {
      return {
        id: item.id,  // 电影id
        title: item.title.length > 6 ? item.title.substring(0, 6) + '...' : item.title,  //电影名 
        rating: {
          average: item.rating.average, // 评分
          stars: item.rating.stars, // 星
          starsArray: utils.convertMovieStarsToArray(item.rating.stars)
        },
        image: item.images.large // 海报
      };
    });
    this.setData({
      moviesListData: arr,
    });
  },
  // 获取数据错误处理
  getMoviesListDataErrorDeal: function (error) {
    wx.showToast({
      title: `获取数据错误: ${error.msg}`,
      duration: 1000,
    })
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
})