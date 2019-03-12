// pages/read/monthly/monthly.js
let api = require('../../../api/api.js');
let util = require('../../../util/util.js');

Page({
  data:{
    articles: [],
    articleType: '',
    title: ''
  },
  // 页面加载
  onLoad: function(options) {
    let title = '';
    if (options.title === '本月') {
      title = util.formatHpsTitle();
    } else {
      title = options.title
    }
    this.setData({
      title: title
    });
    
    let month = options.month;
    let type = options.type;
    if (type === 'serial') {
      type = 'serialcontent';
    }
    api.getArticleByMonth({
      query: {
        type: type,
        month: month
      },
      success: (res) => {
        if (res.data.res === 0) {
          let articles = res.data.data;
          this.setData({
            articleType: type,
            articles: articles
          });
        }
      }
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title
    });
  },
  // 跳转Essay详情
  viewEssayTap: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../essay/essay?id=' + id
    });
  },
  // 跳转Serial详情
  viewSerialTap: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../serial/serial?id=' + id
    });
  },
  // 跳转Question详情
  viewQuestionTap: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../question/question?id=' + id
    });
  }
})