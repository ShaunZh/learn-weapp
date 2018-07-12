var postsData = require('../../data/postsList.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postsList: postsData.postsList
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onready') 
  },
  onPostDetails: function (event) {
    console.log(event)
    var postId = event.currentTarget.dataset.postid
    console.log('onPostTap')
    wx.navigateTo({
      url: './post-details/post-details?id=' + postId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})