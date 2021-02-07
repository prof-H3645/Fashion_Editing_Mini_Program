// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
      {
        "text": "导出",
        "iconPath": "/icon/导出(1).png",
        "selectedIconPath": "/icon/导出.png",
      },
    ],
    files: [
        
    ]
  },
  tabChange(e) {
    console.log('tab change', e)
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
  onUndo(e){
    console.log(e)
  },
  onUndo(e){
    console.log(e)
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            that.setData({
                files: that.data.files.concat(res.tempFilePaths)
            });
        }
    })
},
previewImage: function(e){
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
},
uploadSuccess(e) {
    console.log('upload success', e.detail)
}
})
