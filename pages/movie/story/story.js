// pages/movie/detail/detail.js
let api = require('../../../api/api.js');
let util = require('../../../util/util.js');

Page({
  data:{
    // 具体的对象
    movie: {},
    // 评论列表
    comments: [],
    // 海报轮播图的当前位置值
    current: 0,
    // 控制是否已经关注作者变量
    followed: false,
    // 控制是否显示作者变量
    showUser: false,
    // 用于存储作者关注信息时id
    userId: ''
  },
  // 页面加载
  onLoad: function (options) {
    // 判断用户id是否为0，为0的时候不显示作者信息
    if (options.user_id !== '0') {
      // 用户id不为0时，显示用户信息并且存储用户的id
      let showUser = true;
      this.setData({
        showUser,
        userId: options.user_id
      });
    }
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
                // 将电影详情挂载在电影对象的movie_detail上
                movie.movie_detail = movie_detail;
                // 过滤内容的标签信息
                movie.content = util.filterContent(movie.content);
                this.setData({ movie });
              }
            }
          });
        }
      }
    });
    // 请求评论列表
    api.getCommentList({
      query: {
        type: 'movie',
        id: options.id
      },
      success: (res) => {
        if (res.data.res === 0) {
          let comments = res.data.data.data;
          this.setData({ comments });
        }
      }
    });
    // 读取缓存上的users_is_followed
    let usersIsFollowed = wx.getStorageSync('users_is_followed');
    let userId = this.data.userId;
    // 判断usersIsFollowed是否存在，存在直接读取上面对应用户是否关注的信息
    if (usersIsFollowed) {
      let isFollowed = usersIsFollowed[userId];
      // usersIsFollowed存在，但是上面没有对应用户id是否关注的信息时
      if (!isFollowed) {
        // 初始置为未关注
        usersIsFollowed[userId] = false;
        wx.setStorageSync('users_is_followed', usersIsFollowed);
      }
      this.setData({
        followed: isFollowed
      });
    } else {
      // usersIsFollowed对象不存在时，初始化并且存储到缓存中
      let usersIsFollowed = {};
      usersIsFollowed[userId] = false;
      wx.setStorageSync('users_is_followed', usersIsFollowed);
    }

  },
  // 跳转到电影详情页
  viewMovieDetailTap: function () {
    let id = this.data.movie.movie_id;

    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },
  // 监听滑块的index，实时修改图片右下角的的数字
  handleChange: function (event) {
    let current = event.detail.current;
    this.setData({ current });
  },
  // 作者关注
  userFollowTap: function () {
    // 取得是否关注
    wx.getStorage({
      key: 'users_is_followed',
      success: (res) => {
        let usersIsFollowed = res.data;
        let isFollowed = usersIsFollowed[this.data.userId];
        // 关注取反
        isFollowed = !isFollowed;
        usersIsFollowed[this.data.userId] = isFollowed;
        // 传入新的usersFollowed对象和是否关注的信息
        this.showToast(usersIsFollowed, isFollowed);
      }
    })
  },
  // 关注弹出提示，修改缓存的值
  showToast: function (usersIsFollowed, isFollowed) {
    // 更新作者是否关注的缓存
    wx.setStorageSync('users_is_followed', usersIsFollowed);
    // 更新数据绑定变量，实现文字的切换
    this.setData({
      followed: isFollowed
    });
    // 弹出提示
    wx.showToast({
      title: isFollowed ? "成功关注" : "取消关注",
      duration: 1000,
      icon: "success"
    });
  }
})