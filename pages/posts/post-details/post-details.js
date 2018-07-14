var postsData = require('../../../data/postsList.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postData = postsData.postsList[options.id];
    var that = this;
    var isSuccessGetStorage = false;

    this.setData({
      postData,
    })
    var postsCollected = wx.getStorageSync('posts_collected') || [];
    if (postsCollected.length === 0 && postsCollected[options.id] !== undefined) {
      var postCollected = postsCollected[options.id];
      this.setData({
        postCollected,
        postsCollected
      });
    } else {
      postsCollected[options.id] = false;
      this.setData({
        postCollected: false,
        postsCollected
      });
      wx.setStorageSync('posts_collected', postsCollected);
    }
    // 当音乐已经在播放且当前播放的音乐所在的文章页面与当前停留的文章页面一致时，设置为播放状态
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId 
    === postData.postId) {
      this.setData({
        isPlayingMusic: true,
      });
    }
    this.setMusicMonitor();
  },
  // 设置音乐监控
  setMusicMonitor() {
    wx.onBackgroundAudioPlay((function () {
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.postData.postId;
    }).bind(this));

    wx.onBackgroundAudioPause((function () {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    }).bind(this));
    // 
    wx.onBackgroundAudioPause((function () {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    }).bind(this));

  },
  // 收藏文章监控程序
  onCollectedTap(event) {
    this.data.postsCollected[this.data.postData.postId] = !this.data.postCollected;
    // 更新this.data
    this.setData({
      postCollected: !this.data.postCollected,
    });
    // 更新到storage
    wx.setStorageSync('posts_collected', this.data.postsCollected);  
    wx.showToast({
      title: this.data.postCollected?'收藏成功':'取消收藏',
      duration: 1000,
      icon: 'success'
    });
    wx.showModal({
      title: '收藏',
      content: '是否收藏文章',
      showCancel: true,
      cancelText:'取消',
      cancelColor: 'red',
    })
  },
  // 分享文章监控
  onShareTap(event) {
    wx.showActionSheet({
      itemList: [
        '分享给微信好友',
        '分享到朋友圈',
        '分享给QQ',
        '分享到微博'
      ],
      itemColor: '#405f80',
      success: function(res) {
        console.log(res)
      }
    });
  },
  // 播放音乐监控
  onMusicTap(event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.url,
        title: this.data.postData.music.title,
        coverImgUrl: this.data.postData.music.covertImg
      });
    }
    this.setData({
      isPlayingMusic: !this.data.isPlayingMusic
    });

  }
})