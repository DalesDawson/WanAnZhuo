// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '点击头像登录'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  toLogin: function (e) {
    wx.navigateTo({
      url: '../login/login'
    });
  },
  about: function (e) {
    app.globalData.webUrl = 'https://github.com/DalesDawson/WanAnZhuo'
    wx.navigateTo({
      url: '../web/web'
    });
  },
  mycollect: function (e) {
    let that = this
    let sessionid = wx.getStorageSync('sessionid')
    if (sessionid == null || sessionid == undefined || sessionid == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../collect/collect',
      })
    }
  },
  loginout: function (e) {
    wx.request({
      url: 'https://www.wanandroid.com/user/logout/json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errorCode == 0) {
          wx.removeStorageSync('sessionid')
          wx.removeStorageSync('username')
          wx.showToast({
            title: '成功退出登录',
            icon: 'success',
            duration: 2000
          })
        } else {
          console.log(res.data.errorMsg);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})