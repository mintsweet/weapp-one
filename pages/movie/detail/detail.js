// pages/movie/story/story.js
let api = require('../../../api/api.js');

Page({
  data:{
    movie: {}
  },
  // 页面加载
  onLoad: function (options) {
    // 请求电影故事
    api.getMovieStoryById({
      query: {
        id: options.id
      },
      success: (res) => {
        if (res.data.res === 0) {
          let movie = res.data.data.data[0];
          // 请求电影详情
          api.getMovieById({
            query: {
              id: movie.movie_id
            },
            success: (res) => {
              if (res.data.res === 0) {
                let movie_detail = res.data.data;
                // 电影详情信息挂载到movie对象的movie_detail上
                movie.movie_detail = movie_detail;
                this.setData({ movie });
              }
            }
          });
        }
      }
    });
  }
})