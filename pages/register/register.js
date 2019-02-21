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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({
        disabled: false
      });
    }
  },
  formSubmit: function(e) {
    console.log(e);
    if (e.detail.value.user != "" && e.detail.value.pwd != "") {
      const db = wx.cloud.database();
      db.collection('user').where({
        user: e.detail.value.user,
      }).get({
        complete: function(res) { // res.data 是包含以上定义的两条记录的数组
          console.log(res);
          var arr = res.data;
          // for (var i = 0, len = arr.length; i < len; i++) {
          if (arr.length == 0) {
            wx.showLoading({
              title: '注册中...',
            })
            const db = wx.cloud.database();
            db.collection('user').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                user: e.detail.value.user,
                password: e.detail.value.pwd
              },
              success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log(res);
                wx.hideLoading();
                wx.showToast({
                  title: '注册成功！',
                });
                var pages = getCurrentPages(); //获取当前页面
                var prePage = pages[pages.length - 2]; //获取上一页面
                prePage.setData({
                  user: e.detail.value.user, //给上一页面的变量赋值
                  pwd: e.detail.value.pwd
                });
                
                wx.navigateBack({ //返回上一页面
                  delta: 1,
                })
                // wx.navigateBack();
              }
            })
          } else {
            wx.showToast({
              title: '账号已存在！',
              icon: 'none'
            })
          }
        },
      })
    } else {
      wx.showToast({
        title: '账号或密码不能为空！',
        icon: 'none'
      })
    }
  }
})