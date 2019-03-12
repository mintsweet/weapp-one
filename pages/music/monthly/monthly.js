// pages/music/motnly/monthly.js
let api = require('../../../api/api.js');
let util = require('../../../util/util.js');

Page({
  data:{
    musics: [],
    title: ''
  },
  // 页面加载
  onLoad: function (options) {
    let title = '';
    if (options.title === '本月') {
      title = util.formatHpsTitle();
    } else {
      title = options.title
    }
    this.setData({
      title: title
    });
    // 根据月份请求音乐列表
    api.getMusicByMonth({
      query: {
        month: options.month
      },
      success: (res) => {
        if (res.data.res === 0) {
          let musics = res.data.data;
          this.setData({ musics });
        }
      }
    });
  },
  // 跳转音乐详情页
  viewMusicDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    let userId = event.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `../detail/detail?id=${id}&user_id=${userId}`
    });
  }
})