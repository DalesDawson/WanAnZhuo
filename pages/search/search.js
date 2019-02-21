// pages/search/search.js
const app = getApp()
var that = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagerList: [],
    pagerTitles: [],
    pageNum: 0,
    isloadmore: false,
    isRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    wx.setNavigationBarTitle({
      title: app.globalData.key,
    })
    that.getPagerData()
  },
  getPagerData: function() {
    wx.showNavigationBarLoading()
    wx.request({
      url: "http://www.wanandroid.com/article/query/" + this.data.pageNum + "/json",
      method: 'POST',
      data: {
        k: app.globalData.key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data)
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        var list = res.data.data.datas
        var collectids = app.globalData.collectids
        for (var i in list) {
          for (var j in collectids) {
            if (list[i].id == collectids[j]) {
              list[i].collect = true
            }
          }
        }
        if (that.data.isRefresh) {
          that.setData({
            pagerList: list,
            isRefresh: false
          })
        } else {
          var templist = that.data.pagerList
          var resultlist = templist.concat(list)
          that.setData({
            pagerList: resultlist
          })
        }
        //取出标题中的html标签
        let titles = []
        for (var i in that.data.pagerList) {
          var title = that.data.pagerList[i].title
          //替换掉html标签,全局替换
          title = title.replace(/<[^>]+>/g, "")
          //替换汉字符号,全局替换
          title = title.replace(/&amp;/g, "、")
          title = title.replace(/&mdash;/g, "-")
          //将替换过的标题添加到新数组
          titles.push(title)
        }
        //将新标题数组给标题显示
        that.setData({
          pagerTitles: titles
        })
      },
      fail: function() {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * item点击事件
   */
  detail: function (event) {
    that = this; //不要漏了这句，很重要
    app.globalData.webUrl = event.currentTarget.id
    wx.navigateTo({
      url: '../web/web'
    });
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that = this; //不要漏了这句，很重要
    that.setData({
      pageNum: 0,
      isRefresh: true,
    })
    that.getPagerData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    that = this; //不要漏了这句，很重要
    var page = that.data.pageNum + 1;
    that.setData({
      pageNum: page
    })
    that.getPagerData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})