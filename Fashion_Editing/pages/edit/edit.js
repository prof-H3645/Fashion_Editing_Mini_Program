// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '/images/test.jpg',
    mode: 1,
    canvas_X: 0,
    canvas_Y: 0,
    imgWidth: 0,
    imgHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    Dpr: 2,
    allDrawWorksPath: [],
    maskDrawWorksPath: [],
    sketchDrawWorksPath: [],
    brushDrawWorksPath: [],
    curColor: "#000",
    curSize: "4"
  },
  penConfig: {
    color: "#d71345",
    fontSize: 4
  },
  onLoad: function (options) {
    this.canvasContext = wx.createCanvasContext("myCanvas");
    this.maskCanvasContext = wx.createCanvasContext("mask");
    this.sketchCanvasContext = wx.createCanvasContext("sketch");
    this.brushCanvasContext = wx.createCanvasContext("brush");
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
      canvas_X: 5 * Dpr + (screenWidth - imgWidth) / 2,
      canvas_Y: 10 * Dpr + (screenHeight - imgHeight) / 2,
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      Dpr: Dpr
    })

    if (imgWidth <= screenWidth && imgHeight <= screenHeight) {
      this.canvasContext.drawImage(this.data.imgPath, 0, 0, imgWidth, imgHeight)
    } else {
      this.canvasContext.drawImage(this.data.imgPath, 0, 0, screenWidth, screenWidth)
    }
    this.maskCanvasContext.fillRect(0,0,imgWidth, imgHeight)
    this.maskCanvasContext.draw();
    this.brushCanvasContext.fillRect(0,0,imgWidth, imgHeight)
    this.brushCanvasContext.draw();
    this.sketchCanvasContext.fillRect(0,0,imgWidth, imgHeight)
    this.sketchCanvasContext.draw();
    this.canvasContext.draw();
    this.setData({
      curColor: "#000",
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
  tabChange(e) {
    var index = e.currentTarget.dataset.index;
    console.log('tab change', index);
    if (index < 3)
      this.setData({
        mode: index
      })
    else
      this.setData({
        mode: 2
      })
    if (index == 0) {
      console.log('mask');
      this.popoverSize.onHide();
      this.popoverColor.onHide();
      this.setData({
        curColor: "#fff",
        curSize: "10"
      });
    } else if (index == 1) {
      console.log('sketch');
      this.popoverSize.onHide();
      this.popoverColor.onHide();
      this.setData({
        curColor: "#000",
        curSize: "4"
      });
    } else if (index == 2) {
      this.setData({
        curColor: this.penConfig.color,
        curSize: this.penConfig.fontSize
      })
      wx.createSelectorQuery().select('#size').boundingClientRect(res => {

        this.popoverSize.onDisplay(res);
        this.popoverColor.onHide();
      }).exec();
    } else if (index == 3) {
      this.setData({
        curColor: this.penConfig.color,
        curSize: this.penConfig.fontSize
      })
      wx.createSelectorQuery().select('#color').boundingClientRect(res => {
        this.popoverColor.onDisplay(res);
        this.popoverSize.onHide();
      }).exec();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onClose(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  onUndo(e) {
    console.log(e);
    this.canvasContext.restore();
    this.canvasContext.draw();
  },
  onGenerate(e) {
    console.log(e);
    console.log(this.data.allDrawWorksPath);
    console.log(this.data.maskDrawWorksPath);
    console.log(this.data.sketchDrawWorksPath);
    console.log(this.data.brushDrawWorksPath);
    var app = getApp();
    console.log(this.data.allDrawWorksPath.pop());
    app.globalData.outputPath = this.data.allDrawWorksPath.pop().path;
    wx.navigateTo({
      url: '/pages/output/output',
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
    //设置画笔
    this.canvasContext.setStrokeStyle(this.data.curColor)
    this.canvasContext.setLineWidth(this.data.curSize)
    this.canvasContext.setLineCap('round')
    this.canvasContext.beginPath()
    if(this.data.mode == 0){//蒙版，固定白色+中尺寸
      this.maskCanvasContext.setStrokeStyle("#000")
      this.maskCanvasContext.setLineWidth('10')
      this.maskCanvasContext.setLineCap('round')
      this.maskCanvasContext.beginPath()
    }
    else if(this.data.mode == 1){//素描，由于黑色背景，所以固定白色+细尺寸
      this.sketchCanvasContext.setStrokeStyle("#fff")
      this.sketchCanvasContext.setLineWidth('4')
      this.sketchCanvasContext.setLineCap('round')
      this.sketchCanvasContext.beginPath()
    }
    else if(this.data.mode == 2){//画笔，普通彩色
      this.brushCanvasContext.setStrokeStyle(this.penConfig.color)
      this.brushCanvasContext.setLineWidth(this.penConfig.fontSize)
      this.brushCanvasContext.setLineCap('round')
      this.brushCanvasContext.beginPath()
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
    
    if(this.data.mode == 0){
      this.maskCanvasContext.moveTo(this.startX, this.startY)
      this.maskCanvasContext.lineTo(tmpX, tmpY)
      this.maskCanvasContext.stroke()
    }
    else if(this.data.mode == 1){
      this.sketchCanvasContext.moveTo(this.startX, this.startY)
      this.sketchCanvasContext.lineTo(tmpX, tmpY)
      this.sketchCanvasContext.stroke()
    }
    else if(this.data.mode == 2){
      this.brushCanvasContext.moveTo(this.startX, this.startY)
      this.brushCanvasContext.lineTo(tmpX, tmpY)
      this.brushCanvasContext.stroke()
    }
    this.startX = tmpX
    this.startY = tmpY

    //生成到canvas上
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
        tmpDrawWorkPath = res.tempFilePath;
      },
      fail: res => {
        console.log('获取画布图片失败', res);
      },
    },this)
    if(this.data.mode==0){
      wx.drawCanvas({
        canvasId: 'mask',
        reserve: true,
        actions: this.maskCanvasContext.getActions()
      })
      wx.canvasToTempFilePath({
        canvasId: "mask",
        success: function (res) {
          branchDrawWorkPath = res.tempFilePath;
          self.data.maskDrawWorksPath.push(branchDrawWorkPath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      },this)
      this.data.allDrawWorksPath.push({mode: 0,path: tmpDrawWorkPath});
    }
    else if(this.data.mode==1){
      wx.drawCanvas({
        canvasId: 'sketch',
        reserve: true,
        actions: this.sketchCanvasContext.getActions()
      })
      wx.canvasToTempFilePath({
        canvasId: "sketch",
        success: function (res) {
          branchDrawWorkPath = res.tempFilePath;
          self.data.sketchDrawWorksPath.push(branchDrawWorkPath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      },this)
      this.data.allDrawWorksPath.push({mode: 1,path: tmpDrawWorkPath});
    }
    else if(this.data.mode==2){
      wx.drawCanvas({
        canvasId: 'brush',
        reserve: true,
        actions: this.brushCanvasContext.getActions()
      })
      wx.canvasToTempFilePath({
        canvasId: "brush",
        success: function (res) {
          branchDrawWorkPath = res.tempFilePath;
          self.data.brushDrawWorksPath.push(branchDrawWorkPath);
        },
        fail: res => {
          console.log('获取画布图片失败', res);
        },
      },this)
      this.data.allDrawWorksPath.push({mode: 2,path: tmpDrawWorkPath});
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