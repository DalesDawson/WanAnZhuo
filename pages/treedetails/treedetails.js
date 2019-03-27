// pages/treedetails/treedetails.js
var app = getApp();
Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    treeData: [],
    index: 0,
    pageNum: 0,
    articles: [],
    isFirstRequest: false,
    cid: 0
  },
  // 滚动切换标签样式
  // switchTab: function(e) {
  //   var that = this;
  //   this.setData({
  //     currentTab: e.detail.current
  //   });
  //   this.checkCor();
  // },
  // 点击标题切换当前页时改变样式
  // swichNav: function(e) {
  //   var that = this;
  //   var cur = e.target.dataset.current;
  //   console.log(cur)
  //   if (this.data.currentTaB == cur) {
  //     return false;
  //   } else {
  //     this.setData({
  //       currentTab: cur
  //     })
  //   }
  // },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  // checkCor: function() {
  //   if (this.data.currentTab > 4) {
  //     this.setData({
  //       scrollLeft: 300
  //     })
  //   } else {
  //     this.setData({
  //       scrollLeft: 0
  //     })
  //   }
  // },
  onLoad: function() {
    var that = this;
    this.setData({
      treeData: app.globalData.treeData,
      
      // cid: this.data.treeData[this.data.index].id
    })
    var id=this.data.treeData[0].id;
    this.setData({
      isFirstRequest: true,
      cid:id
    })
    this.getArticles()
    // console.log(this.data.treeData);
    // console.log(this.data.articleData);
    // //  高度自适应
    // wx.getSystemInfo({
    //   success: function(res) {
    //     var clientHeight = res.windowHeight,
    //       clientWidth = res.windowWidth,
    //       rpxR = 750 / clientWidth;
    //     var calc = clientHeight * rpxR;
    //     console.log(calc)
    //     that.setData({
    //       winHeight: calc
    //     });
    //   }
    // });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading();
    var id = this.data.treeData[this.data.index].id;
    this.setData({
      isFirstRequest: true,
      cid: id
    })
    that.setData({
      pageNum: 0,
      isFirstRequest: true
    }),
      that.getArticles()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      pagenum: this.data.pagenum + 1,
      isFirstRequest: false,
    })
    this.getArticles()
  },
  /**
   * picker-view选中事件
   */
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var id = this.data.treeData[this.data.index].id;
    this.setData({
      isFirstRequest: true,
      cid: id
    })
    this.getArticles()
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
  // footerTap: app.footerTap
  getArticles() {
    var that = this
    wx.request({
      // url: app.globalData.HomearticlesUrl,
      url: "https://www.wanandroid.com/article/list/" + this.data.pageNum + "/json",
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
  }
})