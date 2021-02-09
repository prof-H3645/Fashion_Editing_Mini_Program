// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '/images/test.jpg',
    canvasWidth: 0,
    canvasHeight: 0,
    imgWidth: 0,
    imgHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
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
  penConfig:{
    color:"#000",
    fontSize:4
  },
  tabChange(e) {
    console.log('tab change', e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.canvasContext = wx.createCanvasContext("myCanvas")
    const app = getApp();
    this.setData({
      imgPath: app.globalData.imgPath,
      imgWidth: app.globalData.imgWidth,
      imgHeight: app.globalData.imgHeight,
      canvasWidth: (app.globalData.screenWidth - 10) * 2,
      canvasHeight: (app.globalData.screenHeight - 200) * 2,
      screenWidth: app.globalData.screenWidth - 10,
      screenHeight: app.globalData.screenHeight - 200,
    })
    let imgWidth = this.data.imgWidth
    let imgHeight = this.data.imgHeight
    let screenWidth = this.data.screenWidth
    let screenHeight = this.data.screenHeight
    if (imgWidth <= screenWidth && imgHeight <= screenHeight) {
      this.canvasContext.drawImage(this.data.imgPath,50,50,imgWidth,imgHeight, (screenWidth - imgWidth) / 2, (screenHeight - imgHeight) / 2, imgWidth, imgHeight)
    } else {
      this.canvasContext.drawImage(this.data.imgPath, 0, 0, screenWidth, screenWidth)
    }
    this.canvasContext.draw();
    this.setData({
      curColor:"#000000",
      curSize:"4"
    });
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
  onClose(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  onUndo(e) {
    console.log(e);
  },
  onGenerate(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/output/output'
    })
  },
  /**
   * 开始画笔
   */
  touchStart: function (e) {
    //获取当前画笔（手触摸的位置）的x,y坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y

    // console.log("startX: ",this.startX)
    // console.log("startY: ",this.startY)

    //设置画笔
    this.canvasContext.setStrokeStyle(this.penConfig.color)
    this.canvasContext.setLineWidth(this.penConfig.fontSize)
    this.canvasContext.setLineCap('round')
    this.canvasContext.beginPath()
  },

  /**
   * 开始画线条
   */
  touchMove: function (e) {
    let tmpX = e.changedTouches[0].x
    let tmpY = e.changedTouches[0].y

    this.canvasContext.moveTo(this.startX, this.startY)
    this.canvasContext.lineTo(tmpX, tmpY)
    this.canvasContext.stroke()

    this.startX = tmpX
    this.startY = tmpY

    //生成到canvas上
    var tmpActions = this.canvasContext.getActions()
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: tmpActions
    })
  },

  /**
   * 画笔的颜色选择
   */
  colorSelect: function (e) {
    let color = e.currentTarget.dataset.p
    console.log(color)
    this.penConfig.color = color
    this.setData({
      curColor: color
    })
  },

  /**
   * 画笔的粗细选择
   */
  penSizeSelect: function (e) {
    let ps = e.currentTarget.dataset.p
    console.log(ps)
    this.penConfig.fontSize = ps
    this.setData({
      curSize: ps
    })
  },
})