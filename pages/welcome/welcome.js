// pages/welcome/welcome.js
Page({
  data: {
    nickName: '',
    avatar: ''
  },
  onLoad: function () {
    var that = this;
    wx.getUserInfo({
      success: function(res){
        that.setData({
          nickName: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl
        });
      },
      fail: function(res) {
        console.log('fail!');
      }
    });
  },
  viewTap: function () {
    wx.switchTab({
      url: '../home/home',
    });
  } 
})