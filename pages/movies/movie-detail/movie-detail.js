const app = getApp();
const utils = require('../../../utils/utils.js');

// pages/movies/movie-detail/movie-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const movieId = options.movieId;
    const requestUrl = `${app.globalData.g_doubanApiBaseUrl}/v2/movie/subject/${movieId}`;

    utils.http(requestUrl, this.processMovieDetail);
  },
  // 处理获取到的电影详情
  processMovieDetail: function (movieDetail) {
    this.setData({
      id: movieDetail.id, // id
      title: movieDetail.title, // 片名
      countries: movieDetail.countries, // 上映地点， array
      durations: movieDetail.durations, // 时长
      genres: movieDetail.genres, // 影片类型
      pubdate: movieDetail.pubdate, // 上映时间
      ratings_count: movieDetail.ratings_count, // 评分人数
      reviews_count: movieDetail.reviews_count, // 喜欢人数

      directors: movieDetail.directors, // 导演 array
      casts: movieDetail.casts, // 影人 array
      summary: movieDetail.summary, // 影片简介
      writers: movieDetail.writers, // 编剧 array
    })
  }

  
})