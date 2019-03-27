// pages/project/project.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleData: [],
    index: 0,
    pageNum: 1,
    projects: [],
    cid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.request({
      url: app.globalData.ProjectTreeUrl,
      data: {

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data)
        if (res.data.errorCode == 0) {
          that.setData({
            titleData: res.data.data
          })

          var id = that.data.titleData[0].id;
          that.setData({
            isFirstRequest: true,
            cid: id
          })
          that.getProjects()
        } else {
          console.log('获取失败');
        }
      }
    })
    // console.log(this.data.treeData)

  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var id = this.data.titleData[this.data.index].id;
    this.setData({
      isFirstRequest: true,
      cid: id
    })
    this.getProjects()
  },
  /**
   * 请求下面里列表数据
   * http://www.wanandroid.com/project/list/1/json?cid=294
   */
  getProjects() {
    var that = this
    wx.request({
      // url: app.globalData.HomearticlesUrl,
      url: "https://www.wanandroid.com/project/list/" + this.data.pageNum + "/json",
      data: {
        cid: this.data.cid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.errorCode == 0) {

          var responseList = [];
          // console.log('success')
          that.data.isFirstRequest ? responseList = res.data.data.datas : responseList = that.data.projects.concat(res.data.data.datas)
          that.setData({
            projects: responseList
          })
          wx.hideLoading();

          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
          // that.setData({
          //   articles: res.data.data.datas
          // })
        } else {
          console.log('获取失败');
        }
      }
    })
  },
  //列表点击事件
  articleClick: function (e) {
    console.log(e.currentTarget.dataset)
    app.globalData.webUrl = e.currentTarget.dataset.data.link
    // app.globalData.fromWhere = 'homearticles'
    // wx.navigateTo({
    //   url: '../web/web'
    // });
    wx.setClipboardData({
      data: e.currentTarget.dataset.data.link,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    var id = this.data.titleData[this.data.index].id;
    this.setData({
      isFirstRequest: true,
      pageNum: 0,
      cid: id
    })
    this.getProjects()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '玩命加载中',
    })
    var id = this.data.titleData[this.data.index].id;
    this.setData({
      isFirstRequest: false,
      pageNum: this.data.pageNum + 1,
      cid: id
    })
    this.getProjects()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})