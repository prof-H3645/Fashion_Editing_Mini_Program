// app.js
App({
  onLaunch() {
    var that = this;
    wx.getSystemInfo({
      success: (result) => {
        that.globalData.windowWidth = result.windowWidth;
        that.globalData.windowHeight = result.windowHeight;        
        that.globalData.Dpr = result.pixelRatio;
      }
    })
  },
  globalData: {
    imgPath: '/images/test.jpg',
    imgWidth: 500,
    imgHeight: 766,
    windowWidth: 375,
    windowHeight: 603,
    Dpr: 2,
    outputPath: '/images/test.jpg',
    maskPath: '',
    sketchPath: '',
    strokePath: '',
  }
})