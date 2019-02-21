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
    pageNum: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.request({ //请求banner的数据
      url: app.globalData.HomeBannerUrl, //这里是在app.js的globalData中声明的，如同java中的全局变量
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
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
    wx.request({ //请求banner下面的文章列表数据
      url: "http://www.wanandroid.com/article/list/" + this.data.pageNum + "/json",
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
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
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //轮播图点击事件
  swipclick: function(e) {
    console.log(e.currentTarget.dataset)
    app.globalData.webUrl = e.currentTarget.dataset.data.url
    // app.globalData.fromWhere='homeBanner'
    wx.navigateTo({
      url: '../web/web'
    });
  },
  //首页列表点击事件
  articleClick: function(e) {
    console.log(e.currentTarget.dataset)
    app.globalData.webUrl = e.currentTarget.dataset.data.link
    // app.globalData.fromWhere = 'homearticles'
    wx.navigateTo({
      url: '../web/web'
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {//下拉刷新
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
  onReachBottom: function() {//上拉加载更多
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })

    that.setData({
        pageNum: that.data.pageNum + 1, //页码增加请求更多
        isFirstRequest: false
      }),
      that.loadData()
  },
})