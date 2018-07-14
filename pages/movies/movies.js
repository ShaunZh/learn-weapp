const app = getApp();
const utils = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheatersMovies: {},
    comingSoonMovies: {},
    top250Movies: {},
    isDispIndexMovies: true,  // 是否显示首页电影
    isDispSearchMovies: false,  // 是否显示搜索电影
    searchResult: {}, // 搜索的电影
    searchInputInit: '', // 搜索输入框的初始化文字
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
    
    // 发送请求从豆瓣获取数据
    utils.http(inTheatersUrl, (moviesList) => {
      this.processDoubanData(moviesList, 'inTheatersMovies', '正在热映')
    });
    utils.http(comingSoonUrl, (moviesList) => {
      this.processDoubanData(moviesList, 'comingSoonMovies', '即将上映')
    });
    utils.http(top250Url, (moviesList) => {
      this.processDoubanData(moviesList, 'top250Movies', '豆瓣Top250')
    });
  },
  // 处理从豆瓣获取的数据
  processDoubanData: function (moviesList, movieCategory, categoryName) {
    const temp = {};
    const arr = moviesList.subjects.map((item) => {
      return {
        id: item.id,  // 电影id
        title: item.title.length > 6 ? item.title.substring(0, 6)+'...' : item.title,  //电影名 
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
  // 获取数据错误处理
  getMoviesListDataErrorDeal: function (error) {
    wx.showToast({
      title: `获取数据错误: ${error.msg}`,
      duration: 1000,
    })
  },
  // 点击更多事件处理函数
  onMoveMovieTap: function(event) {
    const category = event.currentTarget.dataset.categorytitle;
    console.log(event)
    wx.navigateTo({
      url: `more-movie/more-movie?category=${category}`,
    })
  },
  // 点击搜索栏触发的事件处理函数
  onBindInputFocus: function(event) {
    console.log('focus')

    this.setData({
      isDispSearchMovies: true,
      isDispIndexMovies: false,
    })
  },
  // 点击搜索栏之外的地方触发的事件处理函数
  onBindInputBlur: function(event) {
    console.log('blur')
    // this.setData({
    //   isDispSearchMovies: false,
    //   isDispIndexMovies: true,
    // });
    // this.data.searchResult = {};
  },
  // 点击关闭搜索触发的事件处理函数
  onTapClossSearch:function(event) {
    console.log('close')
    this.setData({
      isDispSearchMovies: false,
      isDispIndexMovies: true,
      searchResult: {},
      searchInputInit: ''
    });
  },
  // 点击确认搜索触发的事件处理函数
  onBindConfirm: function (event) {
    const searchKeyword = event.detail.value;
    const searchUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/search?q=${searchKeyword}`;
    utils.http(searchUrl, (moviesList) => {
      this.processDoubanData(moviesList, 'searchResult', '');
      this.setData({
        isDispSearchMovies: true,
        isDispIndexMovies: false,
      })
    });
  }
})