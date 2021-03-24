// app.js
App({
  onLaunch() {
    var that = this;
    wx.getSystemInfo({
      success: (result) => {
        that.globalData.windowWidth = result.screenWidth;
        that.globalData.windowHeight = result.screenHeight;        
        that.globalData.Dpr = result.pixelRatio;
        // var clientHeight = result.windowHeight,
        //   clientWidth = result.windowWidth,
        //   rpxR = 750 / clientWidth;
        // var helfH = clientHeight * 0.5 * rpxR;
        // var textH = helfH - 100;
        // that.setData({
        //   helfH: helfH,
        //   textH: textH
        // });
      }
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    imgPath: '/images/test.jpg',
    imgWidth: 500,
    imgHeight: 766,
    windowWidth: 375,
    windowHeight: 603,
    Dpr: 2,
    outputPath: '/images/test.jpg',
  }
})