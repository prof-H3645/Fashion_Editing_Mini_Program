// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: [{
        "text": "蒙版",
        "iconPath": "/icon/蒙版 (1).png",
        "selectedIconPath": "/icon/蒙版.png",
      },
      {
        "text": "画笔 ",
        "iconPath": "/icon/实物-画笔(1).png",
        "selectedIconPath": "/icon/实物-画笔.png",
      },
      {
        "text": "颜色",
        "iconPath": "/icon/颜色选择器(1).png",
        "selectedIconPath": "/icon/颜色选择器.png",
      },
      {
        "text": "导出",
        "iconPath": "/icon/导出 (1).png",
        "selectedIconPath": "/icon/导出.png",
      },
    ]
  },
  tabChange(e) {
    console.log('tab change', e)
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
