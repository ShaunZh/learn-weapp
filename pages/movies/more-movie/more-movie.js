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
    requestUrl: '',
    totalMovies: 1,
    isShowBottomTip: false, // 是否加载完数据了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const category = options.category;
    this.data.navigateTitle = category;
    switch (category) {
      case '正在热映': 
        this.data.requestUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/in_theaters`;
      break;
      case '即将上映':
        this.data.requestUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/coming_soon`; 
      break;
      case '豆瓣Top250': 
        // top250
        this.data.requestUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/top250`;
      break;
      default: break;
    }
    this.data.requestUrl.length && 
    this.data.totalMovies > this.data.moviesListData.length
    && utils.http(this.data.requestUrl, this.processDoubanData, this.getMoviesListDataErrorDeal);
    
  },
  // 处理从豆瓣获取的数据
  processDoubanData: function (moviesList) {
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
    const totalMoviesList = this.data.moviesListData.concat(arr);
    this.setData({
      moviesListData: totalMoviesList,
      totalMovies: moviesList.total,
    });
    if (moviesList.total <= totalMoviesList.length) {
      this.setData({
        isShowBottomTip: true,
      });
    }
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  // 获取数据错误处理
  getMoviesListDataErrorDeal: function (error) {
    wx.showToast({
      title: `获取数据错误: ${error.msg}`,
      duration: 1000,
    })
  },
  // 上滑加载更多数据
  onReachBottom: function(event) {
    if (this.data.requestUrl.length && this.data.totalMovies > this.data.moviesListData.length) {
      wx.showNavigationBarLoading();
      utils.http(`${this.data.requestUrl}?start=${this.data.moviesListData.length}&count=20`, this.processDoubanData, this.getMoviesListDataErrorDeal);
    }
  },
  // 下拉刷新
  onPullDownRefresh: function(event) {
    this.data.moviesListData = [];
    utils.http(`${this.data.requestUrl}?start=0&count=20`, this.processDoubanData, this.getMoviesListDataErrorDeal);
    wx.showNavigationBarLoading();
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  // 点击获取文章详情触发的事件处理函数
  onCatchTapMovieDetail: function (event) {
    const movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: `../movie-detail/movie-detail?movieId=${movieId}`,
    })
  }
})