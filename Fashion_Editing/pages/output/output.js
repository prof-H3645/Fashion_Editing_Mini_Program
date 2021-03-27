// pages/output/output.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outputPath: '',
    originalPath: '',
    maskPath: '',
    sketchPath: '',
    strokePath: '',
    loading: true,
    error: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
    const self = this;
    this.setData({
      outputPath: app.globalData.outputPath,
      maskPath: app.globalData.maskPath,
      sketchPath: app.globalData.sketchPath,
      strokePath: app.globalData.strokePath
    })
    var timeoutID = setTimeout(function () {
      self.setData({
        loading: false,
        error: true
      })
    }, 5000)
    var Original64 = wx.getFileSystemManager().readFileSync(app.globalData.outputPath, "base64")
    var Mask64 = wx.getFileSystemManager().readFileSync(app.globalData.maskPath, "base64")
    var Sketch64 = wx.getFileSystemManager().readFileSync(app.globalData.sketchPath, "base64")
    var Stroke64 = wx.getFileSystemManager().readFileSync(app.globalData.strokePath, "base64")
    wx.request({
      url: 'http://mist@gpu08.mistgpu.xyz:35005/generate',
      data: {
        "data": {
          "name": "new_model_easy233",
          "original": Original64,
          "mask": Mask64,
          "sketch": Sketch64,
          "stroke": Stroke64
        }
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success(res) {
        console.log(res.data)
          clearTimeout(timeoutID)
          wx.downloadFile({
            url: "http://" + res.data.result,
            header: {
              'content-type': 'image/png'
            },
            success(res) {
              console.log(res.tempFilePath);
              self.setData({
                outputPath: res.tempFilePath,
                loading: false
              })
              console.log("成功啦" + res.statusCode);
            },
            fail(res) {
              console.log(res);
              self.setData({
                loading: false,
                error: true
              })
            }
          })
      },
      fail(res) {
        console.log(res.data);
      }
    })

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
    wx.hideHomeButton();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  imageLoad: function(e) {
    const app = getApp();
    var imgWidth=e.detail.width;
    var imgHeight=e.detail.height;
    var originalWidth = imgWidth;
    var originalHeight = imgHeight;
    let windowWidth = app.globalData.windowWidth - 20;
    let windowHeight = app.globalData.windowHeight - 300;
    var per = 1.0;
    while (imgWidth <= windowWidth && imgHeight <= windowHeight) {
      per += 0.1;
      imgWidth = per * originalWidth;
      imgHeight = per * originalHeight;
      console.log("增");
    }
    while (imgWidth >= windowWidth || imgHeight >= windowHeight) {
      per *= 0.95;
      imgWidth = per * originalWidth;
      imgHeight = per * originalHeight;
      console.log("减");
    }
    this.setData({
      imgWidth: imgWidth,
      imgHeight: imgHeight,
      img_X: 10 + (windowWidth - imgWidth) / 2,
      windowWidth: windowWidth,
      windowHeight: windowHeight,
    })
  },
  onSave: function (e) {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.outputPath,
      success: function (res) {
        console.log("success!");
        console.log(res);
        wx.showModal({
          title: '保存成功',
          content: '图片成功保存到相册了，快与你的朋友分享吧',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#07c160',
        })
      },
      fail: function (res) {
        console.log("fail!");
        console.log(res);
      }
    })
  },
  onShare: function (e) {
    wx.showShareImageMenu({
      path: this.data.outputPath,
      success: function (res) {
        console.log("success!");
        console.log(res);
      },
      fail: function (res) {
        console.log("fail!");
        console.log(res);
      }
    })
  },
  onReturn:function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})