// pages/music/detail/detail.js
let api = require('../../../api/api.js');
let util = require('../../../util/util.js');

Page({
  data:{
    // 具体的对象
    music: {},
    // 评论列表
    comment: [],
    // 控制是否显示作者
    showUser: false,
    // 用于存储作者关注信息时id
    userId: '',
    // 控制音乐播放暂停
    is_play: false
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

    // 请求音乐故事
    api.getMuiscById({
      query: {
        id: options.id
      },
      success: (res) => {
        if (res.data.res === 0) {
          let music = res.data.data;
          music.story = util.filterContent(music.story);
          this.setData({ music });
        }
      }
    });
    // 请求评论列表
    api.getCommentList({
      query: {
        type: 'music',
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
  // 控制音乐播放暂停
  togglePlayTap: function (event) {
    let isPlay = this.data.is_play;
    let music = this.data.music;

    if (isPlay) {
      this.pauseMusic();
    } else {
      this.playMusic(music);
    }

    this.setData({
      is_play: !isPlay
    });

  },
  // 播放音乐
  playMusic: function (music) {
    // 此处mp3的地址直接用的是音乐的id，因为one的音乐用的是虾米，需要解析虾米的地址，就不做解析了
    // 可以填入能够在线播放的地址测试
    wx.playBackgroundAudio({
      dataUrl: music.music_id,
      title: music.title
    });
  },
  // 暂停音乐
  pauseMusic: function () {
    wx.pauseBackgroundAudio();
  }
})