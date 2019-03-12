// pages/movie/movie.js
let api = require('../../api/api.js');
let util = require('../../util/util.js');

Page({
  data:{
    // 电影数组
    movies: []
  },
  // 页面加载
  onLoad:function (options) {
    // 取得首页的电影简略信息列表
    api.getMovieList({
      success: (res) => {
        if (res.data.res === 0) {
          let movieList = res.data.data;
          // 定义一个电影id数组，遍历movieList取得id存入id数组
          let movieIds = [];
          movieList.forEach((item) => {
            movieIds.push(item.id);
          });
          // 通过id取得电影故事
          this.getMovieStory(movieIds);
        }
      }
    });
  },
  // 遍历电影id数组，取得所有的电影故事
  getMovieStory: function (ids) {
    let movies = this.data.movies;
    // 判断ids是否有内容
    if (ids.length > 0) {
      // 请求电影故事
      api.getMovieStoryById({
        query: {
          id: ids.shift()
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
                  // 修改显示的时间
                  movie.input_date = util.getBeforeTime(movie.input_date);
                  // 设置本地缓存，读取电影故事是否收藏
                  let moviesIsCollected = wx.getStorageSync('movies_is_collected') || {};
                  if (moviesIsCollected[movie.id]) {
                    let isCollected = moviesIsCollected[movie.id];
                    movie.is_collected = isCollected;
                  } else {
                    moviesIsCollected[movie.id] = false;
                    movie.is_collected = false;
                    wx.setStorageSync('movies_is_collected', moviesIsCollected);
                  }
                  // 新的movie对象添加进movies数组中
                  movies.push(movie);
                  // 此时传入的ids截去了第一个元素
                  this.getMovieStory(ids);
                }
              }
            });
          }
        }
      });
    } else {
      // ids的长度为0时，说明添加完成，设置movies
      this.setData({ movies });
    }
  },
  // 跳转电影故事详情页
  viewStoryDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    let userId = event.currentTarget.dataset.userId;

    wx.navigateTo({
      url: `story/story?id=${id}&user_id=${userId}`
    });
  },
  // 收藏事件
  onCollectionTap: function (event) {
    let storyId = event.currentTarget.dataset.storyId;
    this.getStoryIsCollected(storyId);
  },
  // 取得当前点击故事是否收藏的信息
  getStoryIsCollected: function (storyId) {
    wx.getStorage({
      key: 'movies_is_collected',
      success: (res) => {
        let moviesIsCollected = res.data;
        let isCollected = moviesIsCollected[storyId];
        // 收藏取反操作
        isCollected = !isCollected;
        moviesIsCollected[storyId] = isCollected;
        this.showToast(moviesIsCollected, isCollected, storyId);
      }
    });
  },
  // 收藏提示显示，重新设置缓存
  showToast: function (moviesIsCollected, isCollected, storyId) {
    // 更新收藏信息
    wx.setStorageSync('movies_is_collected', moviesIsCollected);
    // 更新数据
    let movies = this.data.movies;
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].id === storyId) {
        movies[i].is_collected = isCollected;
      }
    }
    this.setData({ movies });
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