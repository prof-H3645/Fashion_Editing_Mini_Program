// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: '/images/test.jpg',
    list: [{
        "text": "蒙版",
        "iconPath": "/icon/蒙版(1).png",
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
      // {
      //   "text": "导出",
      //   "iconPath": "/icon/导出(1).png",
      //   "selectedIconPath": "/icon/导出.png",
      // },
    ],
  },
  tabChange(e) {
    console.log('tab change', e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onClose(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  onUndo(e){
    console.log(e);
  },
  onGenerate(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/output/output'
    })
  }
})