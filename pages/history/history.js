// pages/history/history.js
let util = require('../../util/util.js');

Page({
  data:{
    nav: {
      hp: true,
      essay: false,
      serial: false,
      question: false,
      music: false
    },
    dateList: [],
    type: 'hp',
    page: 'home'
  },
  // 页面加载
  onLoad:function(options){
    let dateList = util.getDateList('hp');
    this.setData({
      dateList
    });
  },
  // 菜单选择
  // 图文
  chooseHp: function () {
    let nav = this.data.nav;
    for (let key in nav) {
      nav[key] = false;
    }
    nav['hp'] = true;
    let dateList = util.getDateList('hp');    
    this.setData({ 
      dateList,
      nav,
      type: 'hp',
      page: 'home'
     });
  },
  // 阅读
  chooseEssay: function () {
    let nav = this.data.nav;
    for (let key in nav) {
      nav[key] = false;
    }
    nav['essay'] = true;
    let dateList = util.getDateList('essay');    
    this.setData({ 
      dateList,
      nav,
      type: 'essay',
      page: 'read'
     });
  },
  // 连载
  chooseSerial: function () {
    let nav = this.data.nav;
    for (let key in nav) {
      nav[key] = false;
    }
    nav['serial'] = true;
    let dateList = util.getDateList('serial');    
    this.setData({ 
      dateList,
      nav,
      type: 'serial',
      page: 'read'      
     });
  },
  // 问答
  chooseQuestion: function () {
    let nav = this.data.nav;
    for (let key in nav) {
      nav[key] = false;
    }
    nav['question'] = true;
    let dateList = util.getDateList('question');    
    this.setData({ 
      dateList,
      nav,
      type: 'question',
      page: 'read'    
     });
  },
  // 音乐
  chooseMusic: function () {
    let nav = this.data.nav;
    for (let key in nav) {
      nav[key] = false;
    }
    nav['music'] = true;
    let dateList = util.getDateList('music');
    this.setData({
      dateList,
      nav,
      type: 'music',
      page: 'music'      
    });
  },
  // 根据日期跳转相应的年份页面
  viewMonthlyTap: function (event) {
    let month = event.currentTarget.dataset.month;
    let title = event.currentTarget.dataset.title;
    let type = this.data.type;
    let page = this.data.page;

    wx.navigateTo({
      url: `../${page}/monthly/monthly?month=${month}&title=${title}&type=${type}`
    });
  }
})