<template>
  <div v-if="songInfo" class="song-container">
    <div class="song-main">
      <div class="song-header">
        <div class="song-l">
          <div class="song-info">
            <div class="info-top">
              <h3 class="song-name" :title="songInfo.name">
                {{ songInfo.name }}
                <router-link
                  class="mv-name"
                  :to="{ path: '/mv/detail', query: { id: songInfo.mvId } }"
                  v-if="songInfo.mvId"
                >
                  <i class="iconfont icon-mvlist"></i>
                </router-link>
                <i v-if="songInfo.vip" class="iconfont icon-vip"></i>
              </h3>
              <p class="author-box" :title="singerNames">
                <router-link
                  :to="{ path: '/artist/detail', query: { id: author.id } }"
                  class="song-author"
                  v-for="(author, k) in songInfo.singer"
                  :key="author.name"
                  >{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link
                >
              </p>
              <p class="song-related">
                <span>
                  专辑：
                  <router-link class="song-album" :to="{ path: '/album', query: { id: songInfo.album.id } }">
                    {{ songInfo.album.name }}
                  </router-link>
                </span>
                <span v-if="songInfo.publishTime">
                  发行时间：<em>{{ songInfo.publishTime }}</em>
                </span>
              </p>
              <div class="cover-desc" v-if="coverDesc">
                <h5>专辑简介</h5>
                <p>{{ coverDesc }}</p>
              </div>
            </div>
            <div class="info-bottom">
              <div class="song-oper">
                <span :class="['play-btn', 'play-all', songDisable]" @click="playing(songInfo)"
                  ><i :class="['iconfont', playFontIcon]"></i>
                  {{ songInfo.vip ? 'VIP尊享' : '立即播放' }}</span
                >
                <span class="play-btn play-collect" @click="showAddlist"
                  ><i class="iconfont icon-collect"></i> 收藏</span
                >
                <span class="play-btn play-comment" @click="jumpComment"
                  ><i class="iconfont icon-comment"></i> 评论</span
                >
              </div>
            </div>
          </div>
          <div class="simi-song">
            <h3 class="aside-title">相似歌曲</h3>
            <div class="simi-main">
              <div class="simi-item" v-for="simiItem in simiSong" :key="simiItem.id">
                <div class="simi-info">
                  <router-link class="simi-name" :to="{ path: '/song', query: { id: simiItem.id } }">
                    {{ simiItem.name }}
                  </router-link>
                  <div class="simi-author">
                    <router-link
                      :to="{ path: '/artist/detail', query: { id: author.id } }"
                      class="song-author"
                      v-for="(author, k) in simiItem.singer"
                      :key="author.name"
                      >{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link
                    >
                  </div>
                </div>
                <div class="simi-song-status">
                  <i v-if="simiItem.vip" class="iconfont icon-vip"></i>
                  <i v-else @click="playing(simiItem)" :class="['iconfont', playSimiIcon(simiItem)]"></i>
                  <i class="iconfont icon-add" title="添加到列表" @click="addSongList(simiItem)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="song-lyric">
          <h5>歌词</h5>
          <Lyrics :sId="sId" maxH="530" :currentTime="currentTime" />
        </div>
      </div>
      <div class="song-comments" ref="cBox">
        <CommentList :type="commentType" :sId="sId" />
      </div>
    </div>
    <div class="aside-box">
      <div class="cover">
        <em class="lt"></em>
        <em class="rt"></em>
        <em class="rb"></em>
        <em class="lb"></em>
        <div class="cover-img" :class="[isCurSong ? 'active' : '']" @click.stop="playing(songInfo)">
          <img src="/src/assets/img/stylus.png" class="cover-stylus" />
          <el-image :src="songInfo.album.picUrl">
            <div slot="placeholder" class="image-slot">
              <i class="iconfont icon-placeholder"></i>
            </div>
          </el-image>
        </div>
      </div>
      <div class="sidebar-box playlist-simi" v-if="playlists.length">
        <h3 class="aside-title">包含这首歌的歌单</h3>
        <div class="aside-main playlist-main">
          <router-link
            class="playlist-item"
            :to="{ path: '/playlist/detail', query: { id: item.id } }"
            v-for="item in playlists"
            :key="item.id"
          >
            <el-image :src="item.coverImgUrl">
              <div slot="placeholder" class="image-slot">
                <i class="iconfont icon-placeholder"></i>
              </div>
            </el-image>
            <div class="playlist-info">
              <div class="playlist-name">{{ item.name }}</div>
              <div class="playlist-author">
                By.
                <router-link :to="{ path: '/user', query: { id: item.creator.userId } }">{{
                  item.creator.nickname
                }}</router-link>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="addlistVisible" title="选择要添加的歌单" width="500" center>
    <el-scrollbar height="400px">
      <div class="addlist">
        <el-checkbox-group v-model="songInPlaylist">
          <el-checkbox size="large" v-for="item in crePlaylist" :label="item.id" :key="item.id">
            <template #default>
              {{ songInPlaylist[item.id] }}
              <div class="addlist-item">
                <img :src="item.coverImgUrl" alt="" />
                <div class="info">
                  <span :title="item.name">{{ item.name }}</span>
                  <span>{{ item.trackCount }}首</span>
                </div>
              </div>
            </template>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-scrollbar>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addlistVisible = false">取消</el-button>
        <el-button @click="addlistVisible = false"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getCurrentInstance, reactive, toRefs, onMounted, computed, ref, nextTick } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Lyrics from '@/components/song/Lyrics.vue'
import CommentList from '@/components/Comments.vue'

const { proxy } = getCurrentInstance()
const store = useStore()
const route = useRoute()

const info = reactive({
  songInfo: null,
  sId: 0, // 歌曲的ID
  coverDesc: '',
  simiSong: [],
  playlists: [],
  mlogMv: [],
  commentType: 0, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
  addlistVisible: false,
  crePlaylist: [],
  songInPlaylist: [],
})
const {
  songInfo,
  sId,
  coverDesc,
  simiSong,
  playlists,
  mlogMv,
  commentType,
  addlistVisible,
  crePlaylist,
  songInPlaylist,
} = toRefs(info)
const cBox = ref(null)

const isLogin = computed(() => store.getters.isLogin)
const isPlayed = computed(() => store.getters.isPlayed)
const playList = computed(() => store.getters.playList)
const playIndex = computed(() => store.getters.playIndex)
const curSongInfo = computed(() => playList.value[playIndex.value])

const isCurSong = computed(() => isPlayed.value && curSongInfo.value && curSongInfo.value.id === info.sId)
// 当前播放状态
const playFontIcon = computed(() => (isCurSong.value ? 'icon-audio-pause' : 'icon-audio-play'))
// 若是无版权获取vip歌曲 播放按钮置灰
const songDisable = computed(() => (info.songInfo.license || info.songInfo.vip ? 'disable' : ''))
const currentTime = computed(() => {
  if (info.sId === curSongInfo.value?.id) {
    return store.getters.currentTime
  }
})
// let singerNames = info.songInfo.singer.map(item => item.name).join('/');
const singerNames = computed(() => {
  return info.songInfo.singer.map((item) => item.name).join('/')
})

// 获取歌曲详情
const getSongDetail = async () => {
  const { data: res } = await proxy.$http.songDetail({
    ids: info.sId,
    timestamp: new Date().valueOf(),
  })

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  console.log('getSongDetailRes:', res)

  // 是否有版权播放
  // res.songs[0].license = !res.privileges[0].cp
  info.songInfo = proxy.$utils.formatSongs(res.songs, res.privileges)[0]
  // 显示歌曲简介
  info.coverDesc = info.songInfo.alia.join(' / ')
}

// 播放音乐
const playing = (params) => {
  console.log('curSongInfo.value:', curSongInfo.value)
  console.log('params:', params)
  // 若当前无播放歌曲 或 当前播放歌曲不是本页显示的歌曲  立即播放选中歌曲
  if (!curSongInfo.value || curSongInfo.value.id !== params.id) {
    // 无版权及vip不可播放
    if (params.license) {
      proxy.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
      return
    }

    if (params.vip) {
      proxy.$msg.error('付费歌曲，请在网易云音乐播放')
      return
    }

    store.dispatch('selectPlay', { list: [params] })
    store.commit('SET_PLAYLISTTIPS', true)
  } else {
    store.commit('SET_PLAYSTATUS', !isPlayed.value)
  }
}

const showAddlist = () => {
  if (isLogin.value) {
    console.log('getUserPlaylist>>>>>')
    getUserPlaylist()
    info.addlistVisible = true
  } else {
    proxy.$msg.warning('请登录后进行相关操作')
  }
}
const uId = computed(() => store.getters.userInfo.userId)
const getUserPlaylist = async () => {
  const { data: res } = await proxy.$http.getUserPlaylist({ uid: uId.value })
  info.crePlaylist = res.playlist.filter((item) => !item.subscribed)
  info.crePlaylist.map(async (item) => {
    // info.songInPlaylist[item.id] = await isSongInPlaylist(item.id)
    await isSongInPlaylist(item.id)

    // result && !info.songInPlaylist.includes(result) && info.songInPlaylist.push(result)
  })
  console.log('info.songInPlaylist:', info.songInPlaylist)
}
const isSongInPlaylist = async (playlistId) => {
  const { data: res } = await proxy.$http.playlistTrackAll({ id: playlistId })

  console.log(res)
  console.log('playlistId:', playlistId, 'info.sId:', info.sId)
  console.log(res.songs.some((item) => item.id == info.sId))

  if (res.songs.some((item) => item.id == info.sId)) {
    info.songInPlaylist.push(playlistId)
    // return playlistId
  } else {
    info.songInPlaylist = info.songInPlaylist.filter((item) => item !== playlistId)
  }
  // return res.songs.some((item) => item.id == info.sId)
  // return res.songs.some((item) => {
  //   if (item.id == info.sId) {
  //     return playlistId
  //   }
  // })
}

// 获取相似音乐
const getSimiSong = async () => {
  const { data: res } = await proxy.$http.simiSong({ id: info.sId })
  console.log('res:', res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.simiSong = res.songs.map((item) => {
    const [result] = proxy.$utils.formatSongs([item], [item.privilege])
    return result
  })
  console.log('info.simiSong:', info.simiSong)
}
const playSimiIcon = computed(() => {
  return function (item) {
    // 当前播放的歌曲在相似歌曲列表
    return curSongInfo.value && String(item.id) === curSongInfo.value.id && isPlayed.value
      ? 'icon-audio-pause'
      : 'icon-audio-play'
  }
})
// 添加当前歌曲到播放列表
const addSongList = (item) => {
  store.dispatch('addList', { list: [item] })
  store.commit('SET_PLAYLISTTIPS', true)
}

// 包含这首歌的歌单
const getSimiPlayList = async () => {
  const { data: res } = await proxy.$http.simiPlayList({ id: info.sId })

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  info.playlists = res.playlists
}

const jumpComment = () => {
  cBox.value.scrollIntoView(true)
}

onBeforeRouteUpdate((to) => {
  info.sId = to.query.id
  init()
})

onMounted(() => {
  info.sId = route.query.id
  init()
})

const init = () => {
  if (info.sId) {
    getSongDetail()
    getSimiSong()
    getSimiPlayList()
  }
}
</script>
<style lang="less" scoped>
.song-container {
  display: flex;
  padding-top: 30px;
}
.song-main {
  flex: 1;
}
.song-header {
  display: flex;
}
.song-l {
  flex: 1;
}
.cover {
  position: relative;
  display: inline-block;
  padding: 20px 40px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;

  em {
    position: absolute;
    display: inline-block;
    padding: 10px;
    border-radius: 100%;
    border: 1px solid #fff;
    background: #fafafa;
    box-shadow: 0 2px 7px rgb(0 0 0 / 10%) inset;

    &::before {
      position: absolute;
      top: 6px;
      left: 6px;
      display: inline-block;
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #ddd;
      box-shadow: 0 2px 7px rgb(0 0 0 / 10%);
    }
  }

  .lt,
  .lb {
    left: 10px;
  }

  .rt,
  .rb {
    right: 10px;
  }

  .lt,
  .rt {
    top: 10px;
  }

  .lb,
  .rb {
    bottom: 10px;
  }
}
.cover-img {
  position: relative;
  width: 190px;
  padding: 40px;
  font-size: 0;
  background: url('@/assets/img/disc.png') no-repeat;
  background-size: contain;
  cursor: pointer;

  .cover-stylus {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    display: inline-block;
    width: 30px;
    height: 120px;
    transition: all 0.3s;
    transform-origin: 23px 5px;
    transform: rotateZ(-25deg);
  }

  .el-image {
    width: 190px;
    height: 190px;
    border-radius: 100%;
    animation: soundPaying 15s linear infinite;
    animation-play-state: paused;
  }

  &.active {
    .cover-stylus {
      transform: rotateZ(0);
    }

    .el-image {
      animation-play-state: running;
    }
  }

  // &::after {
  //     content: '';
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     z-index: 2;
  //     width: 30px;
  //     height: 30px;
  //     border-radius: 100%;
  //     transform: translate(-50%,-50%);
  //     background: #000;
  //     box-shadow: 0px 2px 10px 20px rgba(150, 150, 150, 0.5);
  // }

  .iconfont {
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }
}
@keyframes soundPaying {
  from {
    -webkit-transform: rotate(10deg);
    transform: rotate(10deg);
  }

  to {
    -webkit-transform: rotate(370deg);
    transform: rotate(370deg);
  }
}

.song-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 200px;
  padding: 20px;
  height: 300px;
  margin: 0 20px 20px 0;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;
}
.song-lyric {
  flex: 1;
  min-width: 310px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;
  text-align: center;

  h5 {
    font-size: 14px;
    padding: 15px 0;
  }
}
.cover-desc {
  h5 {
    font-size: 14px;
    font-weight: normal;
    color: var(--color-text);
  }

  p {
    width: 100%;
    font-size: 14px;
    color: var(--color-text-main);
    line-height: 21px;
    word-break: break-all;
  }
}
.song-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
  overflow: hidden;
  max-height: 100px;
  font-size: 30px;
  line-height: 50px;
  // padding-bottom: 20px;

  .iconfont {
    margin-right: 10px;
    font-size: 24px;
    color: var(--color-text-height);
  }
}

.author-box {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
  overflow: hidden;
  max-height: 40px;
}
.song-author {
  display: inline-block;

  font-size: 18px;
  color: var(--color-text);
  line-height: 20px;
}
.song-related {
  display: flex;
  flex-direction: column;
  padding: 10px 0 30px;
  font-size: 0;
  color: var(--color-text);

  span {
    display: inline-block;

    padding-right: 30px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    min-width: 200px;
    height: 20px;
    word-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  a,
  em {
    color: var(--color-text-main);
    font-style: normal;
  }
}

.song-oper {
  .play-btn {
    display: inline-block;
    line-height: 16px;
    align-items: center;
    border-radius: 50px;
    padding: 7px 15px;
    cursor: pointer;
    margin: 5px 15px 5px 0;
    background: #f0f0f0;
    color: var(--color-text-main);
  }

  .play-all {
    color: #fff;
    background: var(--color-text-height);
    i {
      color: #fff;
    }
  }

  .disable {
    background: #ccc;
    cursor: not-allowed;
  }
}

.addlist {
  display: flex;
  flex-direction: column;
  .addlist-item {
    display: flex;
    margin: 4px 0;
    img {
      width: 80px;
      height: 80px;
      margin: 10px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      span {
        line-height: 16px;
      }
      span:first-child {
        width: 190px;
        word-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      span:nth-child(2) {
        color: var(--color-text);
      }
    }
  }
}
.el-checkbox.el-checkbox--large {
  height: 100px;
}

.simi-song {
  padding: 20px;
  height: 270px;
  margin: 0 20px 0 0;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;

  .simi-name {
    line-height: 20px;
    font-size: 12px;
    color: #000;
  }

  .simi-author {
    font-size: 0;

    a {
      font-size: 12px;
      color: #999;
    }
  }

  .simi-item {
    display: flex;
    border-bottom: 1px solid #f2f2f2;

    &:last-child {
      border: 0;
    }
  }

  .simi-info {
    flex: 1;
    padding-top: 5px;
  }

  .simi-song-status {
    line-height: 48px;

    i {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
.aside-title {
  position: relative;
  font-size: 16px;
  line-height: 24px;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    margin: 3px 5px 0 0;
    border-radius: 2px;
    background: var(--color-text-height);
    vertical-align: top;
  }
}

.sidebar-box {
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
}

.aside-main {
  .el-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
  }

  .playlist-item {
    display: flex;
    padding-top: 22px;
  }

  .playlist-info {
    flex: 1;
    padding-left: 10px;
  }

  .playlist-name {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
    cursor: pointer;
  }

  .playlist-author {
    height: 20px;
    line-height: 20px;
    margin-top: 20px;
    font-size: 12px;
    color: #999;

    a {
      color: #666;
    }
  }
}

.song-comments {
  // position: relative;
  // padding: 20px;
  // margin-top: 20px;
  // background-color: #fff;
  // box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  // border-radius: 6px;
}
</style>
