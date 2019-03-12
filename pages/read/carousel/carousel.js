// pages/read/carousel/carousel.js
let api = require('../../../api/api.js');

Page({
  data:{
    detail: []
  },
  // 页面加载
  onLoad: function (options) {
    // 请求阅读首页轮播图详情
    api.getReadingCarouselById({
      query: {
        id: options.id
      },
      success: (res) => {
        if (res.data.res === 0) {
          let detail = res.data.data;
          this.setData({ detail })
          console.log(detail);        
        }
      }
    });
  }
})