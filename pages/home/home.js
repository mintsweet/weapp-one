// pages/home/home.js
let api = require('../../api/api.js');
let util = require('../../util/util.js');

Page({
  data: {
    hps: [],
    current: 0
  },
  // 页面加载
  onLoad: function (options) {
    // 取得vols列表id
    api.getHpIdList({
      success: (res) => {
        if (res.data.res === 0) {
          let idList = res.data.data;
          this.getHps(idList);
        }
      }
    });
  },
  // 取得vols列表id对应的详细数据
  getHps: function (idList) {
    let hps = this.data.hps;

    if (idList.length > 0) {
      api.getHpDetailById({
        query: {
          id: idList.shift()
        },
        success: (res) => {
          if (res.data.res === 0) {
            let hp = res.data.data;
            hp.hp_makettime = util.formatHpMakettime(hp.hp_makettime);
            hp.hp_author = util.formatHpAuthor(hp.hp_author);
            hp.hp_content = util.formatHpContent(hp.hp_content);
            // 设置本地存储，实现收藏
            let hpsIsCollected = wx.getStorageSync('hps_is_collected') || {};
            if (hpsIsCollected[hp.hpcontent_id]) {
              let isCollected = hpsIsCollected[hp.hpcontent_id];
              hp.is_collected = isCollected;
            } else {
              hpsIsCollected[hp.hpcontent_id] = false;
              hp.is_collected = false;
              wx.setStorageSync('hps_is_collected', hpsIsCollected);
            }
            hps.push(hp);
          }
          this.getHps(idList);
        }
      });
    } else {
      this.setData({ hps });
    }
  },
  // 小记跳转详情
  viewDetailTap: function (event) {
    let hpId = event.currentTarget.dataset.hpId;
    wx.navigateTo({
      url: 'detail/detail?id=' + hpId 
    });
  },
  // 滑动卡片到最后一张跳转历史
  handleChange: function (event) {
    let current = event.detail.current;
    let hpsLength = this.data.hps.length;

    if (current === hpsLength) {
      this.setData({
        current: hpsLength
      });
      wx.navigateTo({
        url: '../history/history',
        success: (res) => {
          this.setData({
            current: hpsLength - 1
          });
        }
      });
    }
  },
  // 点击收藏事件
  onCollectionTap: function (event) {
    let hpId = event.currentTarget.dataset.hpId;
    this.getHpIsCollected(hpId);
  },
  // 取得所有的卡片是否收藏信息
  getHpIsCollected: function (hpId) {
    wx.getStorage({
      key: 'hps_is_collected',
      success: (res) => {
        let hpsIsCollected = res.data;
        let isCollected = hpsIsCollected[hpId];
        // 取反设置收藏
        isCollected = !isCollected;
        hpsIsCollected[hpId] = isCollected;
        this.showToast(hpsIsCollected, isCollected, hpId);
      }
    });
  },
  // 设置和显示收藏信息
  showToast: function (hpsIsCollected, isCollected, hpId) {
    // 更新收藏信息
    wx.setStorageSync('hps_is_collected', hpsIsCollected);
    // 更新数据
    let hps = this.data.hps;
    for (let i = 0; i < hps.length; i++) {
      if (hps[i].hpcontent_id === hpId) {
        hps[i].is_collected = isCollected;
      }
    }
    this.setData({ hps });
    wx.showToast({
      title: isCollected? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success"
    });
  },
  // 点击分享事件
  onShareTap: function() {
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
      success: function(res) {
        // 显示模态弹窗
        wx.showModal({
          title: "这是分享的标题",
          content: "小程序还没有内容分享功能!"
        });
      }
    });
  },
})