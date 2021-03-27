// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '/images/test.jpg',
    blackPath: '/images/black.png',
    mode: 1,
    canvas_X: 0,
    canvas_Y: 0,
    imgWidth: 0,
    imgHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
    Dpr: 2,
    allDrawWorksPath: [],
    maskDrawWorksPath: [],
    sketchDrawWorksPath: [],
    strokeDrawWorksPath: [],
    curColor: "#000",
    curSize: "4",
    step: 0,
    generating: false
  },
  penConfig: {
    color: "#e23c40",
    fontSize: 10
  },
  onShow: function (options) {
    wx.hideHomeButton();
  },
  onLoad: function (options) {
    this.canvasContext = wx.createCanvasContext("myCanvas");
    this.maskCanvasContext = wx.createCanvasContext("mask");
    this.sketchCanvasContext = wx.createCanvasContext("sketch");
    this.strokeCanvasContext = wx.createCanvasContext("stroke");
    const app = getApp();
    let imgWidth = app.globalData.imgWidth;
    let imgHeight = app.globalData.imgHeight;
    let originalWidth = app.globalData.imgWidth;
    let originalHeight = app.globalData.imgHeight;
    let Dpr = app.globalData.Dpr;
    let windowWidth = app.globalData.windowWidth;
    let windowHeight = app.globalData.windowHeight;
    let toolsBarHeight = windowHeight / 10;
    let canvasWidth = windowWidth - 10;
    let canvasHeight = windowHeight * 3 / 4 - 10;
    let per = 1.0;
    const self = this;
    console.log(app.globalData.windowWidth);
    console.log(app.globalData.windowHeight);
    while (imgWidth <= canvasWidth && imgHeight <= canvasHeight) {
      per += 0.1;
      imgWidth = per * originalWidth;
      imgHeight = per * originalHeight;
      console.log("增");
    }
    while (imgWidth >= canvasWidth || imgHeight >= canvasHeight) {
      per *= 0.95;
      imgWidth = per * originalWidth;
      imgHeight = per * originalHeight;
      console.log("减");
    }
    this.setData({
      imgPath: app.globalData.imgPath,
      imgWidth: imgWidth,
      imgHeight: imgHeight,
      canvas_X: 5 + (canvasWidth - imgWidth) / 2,
      canvas_Y: 5 + (canvasHeight - imgHeight) / 2,
      windowWidth: windowWidth,
      windowHeight: windowHeight,
      toolsBarHeight: toolsBarHeight,
      Dpr: Dpr
    })
    console.log(imgWidth);
    console.log(imgHeight);
    if (imgWidth <= windowWidth && imgHeight <= windowHeight) {
      this.canvasContext.drawImage(this.data.imgPath, 0, 0, imgWidth, imgHeight)
    } else {
      this.canvasContext.drawImage(this.data.imgPath, 0, 0, windowWidth, windowWidth)
    }
    this.maskCanvasContext.fillRect(0, 0, imgWidth, imgHeight)
    this.maskCanvasContext.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: "mask",
        success: function (res) {
          self.setData({
            blackPath: res.tempFilePath
          })
          console.log("hahahahha1");
          self.data.maskDrawWorksPath.push(res.tempFilePath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      }, this)
    });
    this.strokeCanvasContext.fillRect(0, 0, imgWidth, imgHeight)
    this.strokeCanvasContext.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: "stroke",
        success: function (res) {
          console.log("hahahahha3");
          self.data.strokeDrawWorksPath.push(res.tempFilePath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      }, this)
    });
    this.sketchCanvasContext.fillRect(0, 0, imgWidth, imgHeight)
    this.sketchCanvasContext.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: "sketch",
        success: function (res) {
          console.log("hahahahha2");
          self.data.sketchDrawWorksPath.push(res.tempFilePath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      }, this)
    });
    this.canvasContext.draw();
    this.data.allDrawWorksPath.push({
      mode: 3,
      path: this.data.imgPath
    });
    this.setData({
      curColor: "#000",
      curSize: "0.5"
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popoverColor = this.selectComponent('#color');
    this.popoverSize = this.selectComponent('#size');
  },
  tabChange(e) {
    var index = e.currentTarget.dataset.index;
    console.log('tab change', index);
    this.setData({
      mode: index
    })
    if (index == 0) {
      this.setData({
        curColor: "#fff",
        curSize: "10"
      });
    } else if (index == 1) {
      this.setData({
        curColor: "#000",
        curSize: "0.5"
      });
    } else if (index == 2) {
      this.setData({
        curColor: this.penConfig.color,
        curSize: this.penConfig.fontSize
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onClose(e) {
    console.log(e);
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  onRevoke(e) {
    console.log(e);
    var imgWidth = this.data.imgWidth;
    var imgHeight = this.data.imgHeight;
    this.setData({
      step: this.data.step - 1
    })
    console.log(this.data.step);
    var mode = this.data.allDrawWorksPath.pop().mode;
    console.log(mode);
    console.log(this.data.allDrawWorksPath[this.data.allDrawWorksPath.length - 1]);
    this.canvasContext.drawImage(this.data.allDrawWorksPath[this.data.allDrawWorksPath.length - 1].path, 0, 0, imgWidth, imgHeight);
    this.canvasContext.draw();

    if (mode == 0) {
      this.data.maskDrawWorksPath.pop();
      this.maskCanvasContext.drawImage(this.data.maskDrawWorksPath[this.data.maskDrawWorksPath.length - 1], 0, 0, imgWidth, imgHeight);
      this.maskCanvasContext.draw();

    } else if (mode == 1) {
      this.data.sketchDrawWorksPath.pop();
      this.sketchCanvasContext.drawImage(this.data.sketchDrawWorksPath[this.data.sketchDrawWorksPath.length - 1], 0, 0, imgWidth, imgHeight);
      this.sketchCanvasContext.draw();

    } else if (mode == 2) {
      this.data.strokeDrawWorksPath.pop();
      this.strokeCanvasContext.drawImage(this.data.strokeDrawWorksPath[this.data.strokeDrawWorksPath.length - 1], 0, 0, imgWidth, imgHeight);
      this.strokeCanvasContext.draw();

    }
  },
  onGenerate(e) {
    if (!this.data.generating) {
      this.setData({
        generating: true
      })
      console.log(e);
      console.log(this.data.allDrawWorksPath);
      console.log(this.data.maskDrawWorksPath);
      console.log(this.data.sketchDrawWorksPath);
      console.log(this.data.strokeDrawWorksPath);
      const app = getApp();
      const self = this;
      const manager = wx.getFileSystemManager();
      var originalPath = this.data.imgPath;
      var tmpMaskPath = this.data.maskDrawWorksPath[this.data.maskDrawWorksPath.length - 1];
      var tmpSketchPath = this.data.sketchDrawWorksPath[this.data.sketchDrawWorksPath.length - 1];
      var tmpStrokePath = this.data.strokeDrawWorksPath[this.data.strokeDrawWorksPath.length - 1];
      wx.showLoading({
        title: '保存文件中',
      })
      app.globalData.outputPath = manager.saveFileSync(originalPath);
      app.globalData.maskPath = manager.saveFileSync(tmpMaskPath);
      app.globalData.sketchPath = manager.saveFileSync(tmpSketchPath);
      app.globalData.strokePath = manager.saveFileSync(tmpStrokePath);
      setTimeout(function () {
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/output/output',
        })
      }, 100)
    }
  },
  /**
   * 开始画笔
   */
  touchStart: function (e) {
    //获取当前画笔（手触摸的位置）的x,y坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    //设置画笔
    this.canvasContext.setStrokeStyle(this.data.curColor)
    this.canvasContext.setLineWidth(this.data.curSize)
    this.canvasContext.setLineCap('round')
    this.canvasContext.beginPath()
    if (this.data.mode == 0) { //蒙版，固定白色+中尺寸
      this.maskCanvasContext.setStrokeStyle("#fff")
      this.maskCanvasContext.setLineWidth('10')
      this.maskCanvasContext.setLineCap('round')
      this.maskCanvasContext.beginPath()
    } else if (this.data.mode == 1) { //素描，由于黑色背景，所以固定白色+细尺寸
      this.sketchCanvasContext.setStrokeStyle("#fff")
      this.sketchCanvasContext.setLineWidth('0.5')
      this.sketchCanvasContext.setLineCap('round')
      this.sketchCanvasContext.beginPath()
    } else if (this.data.mode == 2) { //画笔，普通彩色
      this.strokeCanvasContext.setStrokeStyle(this.penConfig.color)
      this.strokeCanvasContext.setLineWidth(this.penConfig.fontSize)
      this.strokeCanvasContext.setLineCap('round')
      this.strokeCanvasContext.beginPath()
    }
  },

  /**
   * 开始画线条
   */
  touchMove: function (e) {
    let tmpX = e.changedTouches[0].x
    let tmpY = e.changedTouches[0].y

    this.canvasContext.moveTo(this.startX, this.startY);
    this.canvasContext.lineTo(tmpX, tmpY);
    this.canvasContext.stroke();

    if (this.data.mode == 0) {
      this.maskCanvasContext.moveTo(this.startX, this.startY)
      this.maskCanvasContext.lineTo(tmpX, tmpY)
      this.maskCanvasContext.stroke()
    } else if (this.data.mode == 1) {
      this.sketchCanvasContext.moveTo(this.startX, this.startY)
      this.sketchCanvasContext.lineTo(tmpX, tmpY)
      this.sketchCanvasContext.stroke()
    } else if (this.data.mode == 2) {
      this.strokeCanvasContext.moveTo(this.startX, this.startY)
      this.strokeCanvasContext.lineTo(tmpX, tmpY)
      this.strokeCanvasContext.stroke()
    }
    this.startX = tmpX
    this.startY = tmpY

    //生成到canvas上
    var tmpActions = this.canvasContext.getActions()
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: tmpActions
    })
    if (this.data.mode == 0) {
      wx.drawCanvas({
        canvasId: 'mask',
        reserve: true,
        actions: this.maskCanvasContext.getActions()
      })
    } else if (this.data.mode == 1) {
      wx.drawCanvas({
        canvasId: 'sketch',
        reserve: true,
        actions: this.sketchCanvasContext.getActions()
      })
    } else if (this.data.mode == 2) {
      wx.drawCanvas({
        canvasId: 'stroke',
        reserve: true,
        actions: this.strokeCanvasContext.getActions()
      })
    }
  },
  touchEnd: function (e) {
    //生成到canvas上
    this.setData({
      step: this.data.step + 1
    })
    var tmpActions = this.canvasContext.getActions()
    var tmpDrawWorkPath, branchDrawWorkPath;
    var self = this;
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: tmpActions
    })
    wx.canvasToTempFilePath({
      canvasId: "myCanvas",
      success: function (res) {
        self.data.allDrawWorksPath.push({
          mode: self.data.mode,
          path: res.tempFilePath
        })
      },
      fail: res => {
        console.log('获取画布图片失败', res);
      },
    }, this)
    if (this.data.mode == 0) {
      wx.canvasToTempFilePath({
        canvasId: "mask",
        success: function (res) {
          self.data.maskDrawWorksPath.push(res.tempFilePath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      }, this)
    } else if (this.data.mode == 1) {
      wx.canvasToTempFilePath({
        canvasId: "sketch",
        success: function (res) {
          self.data.sketchDrawWorksPath.push(res.tempFilePath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      }, this)
    } else if (this.data.mode == 2) {
      wx.canvasToTempFilePath({
        canvasId: "stroke",
        success: function (res) {
          self.data.strokeDrawWorksPath.push(res.tempFilePath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      }, this)
    }

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