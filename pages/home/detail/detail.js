// pages/home/detail/detail.js
var api = require('../../../api/api.js');
var util = require('../../../util/util.js');

Page({
  data:{    
    detail: {},
    address: '',
    isMask: false
  },
  onLoad:function(options){
    api.getHpDetailById({
     query: {
       id: options.id
     },
     success: (res) => {
      if (res.data.res === 0) {
        let detail = res.data.data;
        detail.hp_makettime = util.formatHpMakettime(detail.hp_makettime);
        detail.hp_author = util.formatHpAuthor(detail.hp_author);
        detail.hp_content = util.formatHpContent(detail.hp_content);
        this.setData({ detail });
      }
     }
    });
    api.getAddress({
      query: {
        key: 'UU4BZ-WBOHU-3K4VG-4GNLL-X6Z52-C4BGN'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          let address = res.data.result.ad_info.city;
          this.setData({ address });
        }
      }
    })
  },
  // 页面分享
  onShareAppMessage: function () {
    let hp = this.data.detail;
    var shareObj = {
      title: hp.hp_title,
      path: "/pages/home/detail/detal?id=" + hp.hpcontent_id,
      success: (res) => {
        console.log("分享成功！")
      },
      fail: (res) => {
        console.log("分享失败！")
      }
    }
    return shareObj;
  },
  // 弹出蒙层
  openMaskTap: function () {
    this.setData({
      isMask: true
    });
  },
  // 关闭蒙层
  closeMaskTap: function () {
    this.setData({
      isMask: false
    });
  },
  // 相机
  takePhotoTap: function () {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], 
      sourceType: ['camera'],
      success: (res) => {
        console.log('take photo success!');
      }
    });
  },
  // 相册
  openAlbumTap: function () {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], 
      sourceType: ['album'],
      success: (res) => {
        console.log('open album success!');
      }
    });
  }
})