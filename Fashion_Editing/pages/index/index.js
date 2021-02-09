// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    files: [

    ]
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
    // var tempFilePaths = res.tempFilePaths;
    //       for (var i = 0; i < tempFilePaths.length; i++) {
    //         pics.push(tempFilePaths[i]);
    //         //将pics图片数组转为base64字符串数组 如果上传时不需要的话可以忽略此处
    //         wx.getFileSystemManager().readFile({
    //           filePath: tempFilePaths[i], //选择图片返回的相对路径
    //           encoding: 'base64', //编码格式
    //           success: res => { //成功的回调
    //             base64Pic.push(res.data);
    //             that.setData({
    //               pics: pics,
    //               base64Pic: base64Pic,
    //             });
    //           }, fail: function (res) {
    //             that.show("图片上传失败！");
    //           }
    //         });

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
  onUndo(e) {
    console.log(e)
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
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('some error')
      }, 1000)
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
    wx.navigateTo({
      url: '/pages/edit/edit'
    })
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  }
})