// pages/collect/collect.js
const {
  default: netutils
} = require("../../utils/netutils");
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    pageNum: 0,
    collection: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function (options) {
      var that = this
      wx.setNavigationBarTitle({
        title: '收藏',
      })
      let header = {
        cookie: wx.getStorageSync('sessionid')
      }
      netutils.getCollectList(header, that.data.pageNum).then(function (res) {
        console.log(res)
        if (res.data.errorCode == 0) {

          var responseList = [];
          // console.log('success')
          that.data.isFirstRequest ? responseList = res.data.data.datas : responseList = that.data.collection.concat(res.data.data.datas)
          that.setData({
            collection: responseList
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
      })
    },
    //首页列表点击事件
    itemClick: function (e) {
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
    likeClick: function (e) {
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
        if (collect){
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
            if (collect) {
              that.data.collection[index].collect = false
              wx.showToast({
                title: '收藏成功！',
                icon: 'none',
                duration: 2000
              })
            } else {
              that.data.collection[index].collect = true
              wx.showToast({
                title: '取消收藏成功！',
                icon: 'none',
                duration: 2000
              })
            }
            that.setData({
              collection: that.data.collection
            })
          }
        }, function (error) {
          console.log(error)
        }).catch(function () {
          console.error("get location failed")
        })
      }
    },
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
})