// pages/output/output.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outputPath: '',
    originalPath:'',
    maskPath:'',
    sketchPath:'',
    brushPath:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.setData({
      outputPath : app.globalData.outputPath,
      maskPath:app.globalData.maskPath,
      sketchPath:app.globalData.sketchPath,
      brushPath:app.globalData.brushPath
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
  },
  onGenerate:function(){
    var Original64 = wx.getFileSystemManager().readFileSync('images/test.jpg',"base64")
    var Mask64 = wx.getFileSystemManager().readFileSync('images/mask.png',"base64")
    var Sketch64 = wx.getFileSystemManager().readFileSync('images/sketch.ong',"base64")
    var Stroke64 = wx.getFileSystemManager().readFileSync('images/stroke.png',"base64")

    wx.request({
      url: 'https://gpu193.mistgpu.xyz:30324/generate',
      data:{
        "data":{
          "original":Original64,
          "mask":Mask64,
          "sketch":Sketch64,
          "stroke":Stroke64
        }
      },
      header:{
        'content-type':'application/json'
      },
      method:'POST',
      success(res){
        console.log(res.data)
      },
      fail(res){
        console.log(res.data)
      }
    })
  },
  onDownload:function(){
    wx.downloadFile({
      url: '',
      success(res){
        console.log(res.tempFilePath)
      },
      fail(res){
        console.log(res)
      }
    })
  }
})