// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    files: [

    ],
    windowWidth: 375,
    windowHeight: 603,
    Dpr: 2,
  },

  handleChooseAlbum() {
    //系统API，让用户在相册中选择图片（或者拍照）
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      success: (res) => {

        //1、取出路径
        const path = res.tempFilePaths[0]
        //2、设置imgPath
        const app = getApp();
        console.log(app.globalData.imgPath)
        console.log(path);
        app.globalData.imgPath = path;
        wx.getImageInfo({
          src: path,
          success: data => {
            app.globalData.imgWidth = data.width;
            app.globalData.imgHeight = data.height;
          }
        })
        wx.navigateTo({
          url: '/pages/edit/edit'
        })
      },
      fail: function (res) {
        console.log("图片上传失败！");
      }
    });

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    var app = getApp();
    let Dpr = app.globalData.Dpr;
    let windowWidth = app.globalData.windowWidth;
    let windowHeight = app.globalData.windowHeight;
    this.setData({
      windowWidth: windowWidth,
      windowHeight: windowHeight,
      Dpr: Dpr,
      width: windowWidth* 0.50
    })
    
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({

      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
})