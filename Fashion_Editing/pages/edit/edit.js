// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '/images/test.jpg',
    canvas_X: 0,
    canvas_Y: 0,
    imgWidth: 0,
    imgHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    Dpr: 2,
    allDrawWorksPath: [],
    curColor: "#000000",
    curSize: "4"
  },
  penConfig: {
    color: "#000",
    fontSize: 4
  },
  tabChange(e) {
    var index = e.currentTarget.dataset.index;
    console.log('tab change', index);
    if (index == 0) {
      console.log('mask');
      this.popoverSize.onHide();
      this.popoverColor.onHide();
      this.penConfig.color = '#fff';
      this.penConfig.fontSize = 4;
      this.setData({
        curColor: "#ffffff",
        curSize: "4"
      });
    }
    else if (index == 1) {
      console.log('sketch');
      this.popoverSize.onHide();
      this.popoverColor.onHide();
      this.penConfig.color = '#fff';
      this.penConfig.fontSize = 4;
      this.setData({
        curColor: "#000",
        curSize: "4"
      });
    }
     else if (index == 2) {
      wx.createSelectorQuery().select('#size').boundingClientRect(res => {
        this.popoverSize.onDisplay(res);
        this.popoverColor.onHide();
      }).exec();
    } else if (index == 3) {
      wx.createSelectorQuery().select('#color').boundingClientRect(res => {
        this.popoverColor.onDisplay(res);
        this.popoverSize.onHide();
      }).exec();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.canvasContext = wx.createCanvasContext("myCanvas");
    const app = getApp();
    let imgWidth = app.globalData.imgWidth;
    let imgHeight = app.globalData.imgHeight;
    let Dpr = app.globalData.Dpr;
    let screenWidth = app.globalData.screenWidth - 10 * Dpr;
    let screenHeight = app.globalData.screenHeight - 100 * Dpr;
    let per = 1.0;
    while (per > 0.0 && (imgWidth >= screenWidth || imgHeight >= screenHeight)) {
      per -= 0.05;
      imgWidth = per * app.globalData.imgWidth;
      imgHeight = per * app.globalData.imgHeight;
    }
    this.setData({
      imgPath: app.globalData.imgPath,
      imgWidth: imgWidth,
      imgHeight: imgHeight,
      canvas_X: 5 * Dpr +(screenWidth - imgWidth) / 2,
      canvas_Y: 10 * Dpr +(screenHeight - imgHeight) / 2,
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      Dpr: Dpr
    })

    if (imgWidth <= screenWidth && imgHeight <= screenHeight) {
      this.canvasContext.drawImage(this.data.imgPath, 0,0, imgWidth, imgHeight)
    } else {
      this.canvasContext.drawImage(this.data.imgPath, 0, 0, screenWidth, screenWidth)
    }
    this.canvasContext.draw();
    this.setData({
      curColor: "#000000",
      curSize: "4"
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popoverColor = this.selectComponent('#color');
    this.popoverSize = this.selectComponent('#size');
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
    var self = this;
    wx.canvasToTempFilePath({
      canvasId: "myCanvas",
      success: function (res) {
        var imgPath = res.tempFilePath;
         console.log(imgPath);
         var allDrawWorksPath = self.data.allDrawWorksPath;
         allDrawWorksPath.push(imgPath);
         self.setData({
            allDrawWorksPath: allDrawWorksPath,
         });
         console.log(imgPath);
         var app = getApp();
         app.globalData.outputPath = imgPath;
      },
      fail: res => {
         console.log('获取画布图片失败', res);
      },
      complete: res => {
        wx.navigateTo({
          url: '/pages/output/output'
        })
      }
   })

  },
  /**
   * 开始画笔
   */
  touchStart: function (e) {
    this.popoverColor.onHide();
    this.popoverSize.onHide();
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