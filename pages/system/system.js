// pages/system/system.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    treeData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.TreeUrl,
      data: {

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errorCode == 0) {
          that.setData({
            treeData: res.data.data
          })
        } else {
          console.log('获取失败');
        }
      }
    })
  },
  //item的点击事件
  treeClick: function (e) {
    console.log(e.currentTarget.dataset.data)
    app.globalData.treeData = e.currentTarget.dataset.data.children
    // app.globalData.fromWhere = 'homeArticle'
    wx.navigateTo({
      url: '../treedetails/treedetails'
    });
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