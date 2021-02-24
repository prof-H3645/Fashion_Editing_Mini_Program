// pages/output/output.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outputPath: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.setData({
      outputPath : app.globalData.outputPath
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
  onSave: function(e){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.outputPath,
      success: function(res){
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
      fail: function(res) {
        console.log("fail!");
        console.log(res);
      }
    })
  },
  onShare: function(e){
    wx.showShareImageMenu({
      path: this.data.outputPath,
      success: function(res){
        console.log("success!");
        console.log(res);
      },
      fail: function(res) {
        console.log("fail!");
        console.log(res);
      }
    })
  }
})