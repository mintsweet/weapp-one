// pages/read/question/question.js
let api = require('../../../api/api.js');
let util = require('../../../util/util.js');

Page({
  data:{
    question: {},
    // 评论列表
    comments: [],
    // 推荐内容
    recommend: {},
    // 是否显示文章作者
    showUser: false,
    // 控制是否已经关注作者变量
    followed: false,
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
    // 请求question详情
    api.getQuestionById({
      query: {
        id: options.id
      },
      success: (res) => {
        if (res.data.res === 0) {
          let question = res.data.data;
          question.answer_content = util.filterContent(question.answer_content);
          this.setData({ question });
        }
      }
    });
    // 请求评论列表
    api.getCommentList({
      query: {
        type: 'question',
        id: options.id
      },
      success: (res) => {
        if (res.data.res === 0) {
          let comments = res.data.data.data;
          this.setData({ comments });
        }
      }
    });
    // 请求推荐内容
    api.getQuestionById({
      query: {
        id: options.id - 1
      },
      success: (res) => {
        if (res.data.res === 0) {
          let recommend = res.data.data;
          this.setData({ recommend });
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
  },
  // 推荐跳转
  viewRecommendTap: function (event) {
    let id = event.currentTarget.dataset.id;
    let userId = event.currentTarget.dataset.userId;    
    wx.navigateTo({
      url: `question?id=${id}&user_id=${userId}`
    });
  }
})