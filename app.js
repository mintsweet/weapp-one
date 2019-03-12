App({
  onLaunch: function() {
    wx.login({
      success: function(res) {
        console.log('login success');
      },
      fail: function(res) {
        console.log('login fail');
      }
    });
  }
})