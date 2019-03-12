// pages/music/music.js
let api = require('../../api/api.js');
let util = require('../../util/util.js');

Page({
  data:{
    // 音乐列表数据
    musics: [],
    // 控制是否正在播放
    is_play: false
  },
  // 页面加载
  onLoad: function (options) {
    // 请求音乐首页的id列表
    api.getMusicIdList({
      success: (res) => {
        if (res.data.res === 0) {
          let idList = res.data.data;
          this.getMusicDetail(idList);
        }
      }
    });
  },
  // 获取音乐首页每个id的详情
  getMusicDetail: function (idList) {
    let musics = this.data.musics;
    if (idList.length > 0) {
      // 请求每个id对应的详情
      api.getMuiscById({
        query: {
          id: idList.shift()
        },
        success:  (res) => {
          if (res.data.res === 0) {
            let music = res.data.data;
            music.story = util.filterContent(music.story);
            music.last_update_date = util.getBeforeTime(music.last_update_date);
            // 设置本地缓存，读取电影故事是否收藏
            let musicsIsCollected = wx.getStorageSync('musics_is_collected') || {};
            if (musicsIsCollected[music.id]) {
              let isCollected = musicsIsCollected[music.id];
              music.is_collected = isCollected;
            } else {
              musicsIsCollected[music.id] = false;
              music.is_collected = false;
              wx.setStorageSync('musics_is_collected', musicsIsCollected);
            }
            // 取得的music添加到musics数组中
            musics.push(music);
          }
          this.getMusicDetail(idList);
        }
      });
    } else {
      this.setData({ musics });
    }
  },
  // 跳转到音乐详情页
  viewMuiscDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    let userId = event.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `detail/detail?id=${id}&user_id=${userId}`
    });
  },
  // 收藏事件
  onCollectionTap: function (event) {
    let musicId = event.currentTarget.dataset.musicId;
    this.getMusicIsCollected(musicId);
  },
  // 取得当前点击故事是否收藏的信息
  getMusicIsCollected: function (musicId) {
    wx.getStorage({
      key: 'musics_is_collected',
      success: (res) => {
        let musicsIsCollected = res.data;
        let isCollected = musicsIsCollected[musicId];
        // 收藏取反操作
        isCollected = !isCollected;
        musicsIsCollected[musicId] = isCollected;
        this.showToast(musicsIsCollected, isCollected, musicId);
      }
    });
  },
  // 收藏提示显示，重新设置缓存
  showToast: function (musicsIsCollected, isCollected, musicId) {
    // 更新收藏信息
    wx.setStorageSync('musics_is_collected', musicsIsCollected);
    // 更新数据
    let musics = this.data.musics;
    for (let i = 0; i < musics.length; i++) {
      if (musics[i].id === musicId) {
        musics[i].is_collected = isCollected;
      }
    }
    this.setData({ musics });
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
  },
  // 控制音乐播放暂停
  togglePlayTap: function (event) {
    let musicId = event.currentTarget.dataset.id;
    let isPlay = this.data.is_play;
    let musics = this.data.musics;
    // 根据id取得数组中对用的music
    let music = musics.find((music) => music.id === musicId);

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