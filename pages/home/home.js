const { default: netutils } = require("../../utils/netutils");

// pages/home/home.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFirstRequest: true,
    BannerData: [],
    swiperCurrent: 0,
    articles: [],
    pageNum: 0,
    collectPic:'../images/collect_normal.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.HomeBannerUrl,
      data: {

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errorCode == 0) {
          that.setData({
            BannerData: res.data.data
          })
        } else {
          console.log('获取失败');
        }
      }
    })

    this.setData({
      isFirstRequest: true
    }),
      this.loadData()
  },
  //加载数据
  loadData() {
    var that = this
    wx.request({
      // url: app.globalData.HomearticlesUrl,
      url: "https://www.wanandroid.com/article/list/" + this.data.pageNum + "/json",
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errorCode == 0) {

          var responseList = [];
          // console.log('success')
          that.data.isFirstRequest ? responseList = res.data.data.datas : responseList = that.data.articles.concat(res.data.data.datas)
          that.setData({
            articles: responseList
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
  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //轮播图点击事件
  swipclick: function (e) {
    console.log(e.currentTarget.dataset)
    app.globalData.webUrl = e.currentTarget.dataset.data.url
    // app.globalData.fromWhere='homeBanner'
    // wx.navigateTo({
    //   url: '../web/web'
    // });
    wx.setClipboardData({
      data: e.currentTarget.dataset.data.url,
      success(res) {
        wx.getClipboardData({
          success(res) {
            // console.log(res.data) // data
          }
        })
      }
    })
  },
  //首页列表点击事件
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
            // console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 收藏心点击事件
   * @param {} e 
   */
  collect: function (e) {
    let that = this
    let sessionid = wx.getStorageSync('sessionid')
    if (sessionid == null || sessionid == undefined || sessionid == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      let collect = e.currentTarget.dataset.collect
      let id = e.currentTarget.dataset.id
      let index = e.currentTarget.dataset.index
      let collectString = ''
      if (!collect){
        collectString = 'collect'
      }else{
        collectString = 'uncollect_originId'
      }
      let header = {
        cookie: wx.getStorageSync('sessionid')
      }
      netutils.postCollectUrl(collectString, id, header).then(function (res) {
        console.log(res)
        if(res.data.errorCode == -1001){
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }else{
          if (!collect) {
            that.data.articles[index].collect = true
            wx.showToast({
              title: '收藏成功！',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.data.articles[index].collect = false
            wx.showToast({
              title: '取消收藏成功！',
              icon: 'none',
              duration: 2000
            })
          }
          that.setData({
            articles: that.data.articles
          })
        }
      }, function (error) {
        console.log(error)
      }).catch(function () {
        console.error("get location failed")
      })
    }
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
    var that = this;
    wx.showNavigationBarLoading();
    that.setData({
        pageNum: 0,
        isFirstRequest: true
      }),
      that.loadData()


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.setData({
        pageNum: that.data.pageNum + 1,
        isFirstRequest: false
      }),
      that.loadData()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})