// pages/read/read.js
let api = require('../../api/api.js');
let util = require('../../util/util.js');

Page({
  data: {
    carousel: [],
    articles: {},
    current: 0
  },
  // 页面加载
  onLoad: function (options) {
    // 请求阅读页滑块内容
    api.getReadingCarousel({
      success:  (res) => {
        if (res.data.res === 0) {
          let carousel = res.data.data;
          this.setData({ carousel });
        }
      }
    });
    // 请求首页的文章列表
    api.getReadingIndex({
      success: (res) => {
        if (res.data.res === 0) {
          let articles = res.data.data;

          // 设置本地缓存，读取电影故事是否收藏和过滤时间
          let articlesIsCollected = wx.getStorageSync('articles_is_collected') || {};

          articles.essay.map((essay) => {
            if (articlesIsCollected[essay.content_id]) {
              let isCollected = articlesIsCollected[essay.content_id];
              essay.is_collected = isCollected;
            } else {
              articlesIsCollected[essay.content_id] = false;
              essay.is_collected = false;
              wx.setStorageSync('articles_is_collected', articlesIsCollected);
            }
            essay.hp_makettime = util.getBeforeTime(essay.hp_makettime);
          });
          articles.serial.map((serial) => {
            if (articlesIsCollected[serial.id]) {
              let isCollected = articlesIsCollected[serial.id];
              serial.is_collected = isCollected;
            } else {
              articlesIsCollected[serial.id] = false;
              serial.is_collected = false;
              wx.setStorageSync('articles_is_collected', articlesIsCollected);
            }
            serial.maketime = util.getBeforeTime(serial.maketime);
          });
          articles.question.map((question) => {
            if (articlesIsCollected[question.question_id]) {
              let isCollected = articlesIsCollected[question.question_id];
              question.is_collected = isCollected;
            } else {
              articlesIsCollected[question.question_id] = false;
              question.is_collected = false;
              wx.setStorageSync('articles_is_collected', articlesIsCollected);
            }
            question.question_makettime = util.getBeforeTime(question.question_makettime);
          });
          this.setData({ articles });
        } 
      }
    });
  },
  // 滑块页面详情
  viewCarouselDetailTap: function (event) {
    let carouselId = event.currentTarget.dataset.carouselId;
    wx.navigateTo({
      url: 'carousel/carousel?id=' + carouselId
    });
  },
  // 跳转Essay详情
  viewEssayTap: function (event) {
    let id = event.currentTarget.dataset.id;
    let userId = event.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `essay/essay?id=${id}&user_id=${userId}`
    });
  },
  // 跳转Serial详情
  viewSerialTap: function (event) {
    let id = event.currentTarget.dataset.id;
    let userId = event.currentTarget.dataset.userId;    
    wx.navigateTo({
      url: `serial/serial?id=${id}&user_id=${userId}`
    });
  },
  // 跳转Question详情
  viewQuestionTap: function (event) {
    let id = event.currentTarget.dataset.id;
    let userId = event.currentTarget.dataset.userId;    
    wx.navigateTo({
      url: `question/question?id=${id}&user_id=${userId}`
    });
  },
  // 收藏事件
  onCollectionTap: function (event) {
    let articleId = event.currentTarget.dataset.articleId;
    this.getArticleIsCollected(articleId);
  },
  // 取得当前点击故事是否收藏的信息
  getArticleIsCollected: function (articleId) {
    wx.getStorage({
      key: 'articles_is_collected',
      success: (res) => {
        let articlesIsCollected = res.data;
        let isCollected = articlesIsCollected[articleId];
        // 收藏取反操作
        isCollected = !isCollected;
        articlesIsCollected[articleId] = isCollected;
        this.showToast(articlesIsCollected, isCollected, articleId);
      }
    });
  },
  // 收藏提示显示，重新设置缓存
  showToast: function (articlesIsCollected, isCollected, articleId) {
    // 更新收藏信息
    wx.setStorageSync('articles_is_collected', articlesIsCollected);
    // 更新数据
    let articles = this.data.articles;
    articles.essay.map((essay) => {
      if (essay.content_id === articleId) {
        essay.is_collected = isCollected;
      }
    });
    articles.serial.map((serial) => {
      if (serial.id === articleId) {
        serial.is_collected = isCollected;
      }
    });
    articles.question.map((question) => {
      if (question.question_id === articleId) {
        question.is_collected = isCollected;
      }
    });
    this.setData({ articles });
    // 弹出提示
    wx.showToast({
      title: isCollected? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success"
    });
  },
  // 分享事件
  onShareTap: function () {
    var itemList = [
      "分享给好友",
      "分享到朋友圈",
      "分享到QQ空间",
      "分享到微博"
    ]
    // 操作菜单栏
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#666",
      success: (res) => {
        // 显示模态弹窗
        wx.showModal({
          title: "这是分享的标题",
          content: "小程序还没有内容分享功能!"
        });
      }
    });
  }
})