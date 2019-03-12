// pages/home/monthly/monthly.js
let api = require('../../../api/api.js');
let util = require('../../../util/util.js');

Page({
  data:{
    title: '',
    monthly: []
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

    api.getHpByMonth({
      query: {
        month: options.month
      },
      success: (res) => {
        if (res.data.res === 0) {
          let monthly = res.data.data;

          monthly.map((hp) => {
            hp.hp_makettime = util.formatHpListTime(hp.hp_makettime);
          });
          this.setData({ monthly });
        }
      }
    });
  },
  // 页面初次渲染完成
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.title
    });
  },
  // 小记跳转详情
  viewDetailTap: function (event) {
    let hpId = event.currentTarget.dataset.hpId;
    wx.navigateTo({
      url: '../detail/detail?id=' + hpId 
    });
  }
})