Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    user: '',
    pwd: '',
    userinput: false,
    pwdinput: false,
  },
  noinput: function(e) {
    this.setData({
      user: e.detail.value
    });
    this.setData({
      userinput: true
    });
    if (this.data.userinput == true && this.data.pwdinput == true) {
      this.setData({
        disabled: false
      });
    }
  },
  pwdinput: function(e) {
    this.setData({
      pwd: e.detail.value
    });
    this.setData({
      pwdinput: true
    });
    if (this.data.userinput == true && this.data.pwdinput == true) {
      this.setData({
        disabled: false
      });
    }
  },
  formSubmit: function(e) {
    // wx.showLoading({
    //   title: '登录中...',
    // })
    // console.log(e);
    // this.setData({
    //   disabled: true
    // });
    const db = wx.cloud.database();
    db.collection('user').where({
      user: e.detail.value.user,
    }).get({
      complete: function(res) { // res.data 是包含以上定义的两条记录的数组
        console.log(res);
        var arr = res.data;
        // for (var i = 0, len = arr.length; i < len; i++) {
        if (arr.length == 0) {
          wx.showToast({
            title: '账号不存在！',
            icon: 'none'
          });

        } else {
          if (arr[0].password == e.detail.value.pwd) {
            var pages = getCurrentPages(); //获取当前页面
            var prePage = pages[pages.length - 2]; //获取上一页面
            prePage.setData({
              username: e.detail.value.user //给上一页面的变量赋值
            });
            wx.hideLoading();
            wx.showToast({
              title: '登录成功！',
            });
            wx.navigateBack({ //返回上一页面
              delta: 1,
            })
            // }
          } else {
            wx.showToast({
              title: '密码错误！',
              icon: 'none'
            })
          }
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.init({
      env: 'for-cloud-dev-5c610c',
      traceUser: true
    });
  },

  toRegister: function(e) {
    wx.navigateTo({
      url: '../register/register'
    });
  }
})