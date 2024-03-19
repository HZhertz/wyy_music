<template>
  <div class="playlist_main">
    <div class="cover">
      <div class="cover-img">
        <el-image :src="playlistInfo.coverImgUrl">
          <div slot="placeholder" class="image-slot">
            <i class="iconfont icon-placeholder"></i>
          </div>
        </el-image>
      </div>
      <div class="cover-info">
        <div class="cover-header">
          <div class="cover-title">
            {{ playlistInfo.name }}
          </div>
          <div class="cover-collect-author" v-if="true">
            <router-link
              class="collect-author"
              :to="{ path: '/user', query: { id: item.userId } }"
              v-for="item in subscribers"
              :key="item.userId"
            >
              <el-image :src="item.avatarUrl">
                <div slot="placeholder" class="image-slot">
                  <i class="iconfont icon-placeholder"></i>
                </div>
              </el-image>
            </router-link>
          </div>
        </div>
        <div class="cover-author-tags">
          <div class="cover-author" v-if="playlistInfo.creator">
            <el-image :src="playlistInfo.creator.avatarUrl" class="cover-avatar">
              <div slot="placeholder" class="image-slot">
                <i class="iconfont icon-placeholder"></i>
              </div>
            </el-image>
            <div class="cover-name">{{ playlistInfo.creator.nickname }}</div>
            <div class="cover-date">
              {{ $utils.formartDate(playlistInfo.createTime, 'yyyy-MM-dd') }}
            </div>
          </div>
          <div class="cover-tags" v-if="playlistInfo.tags">
            <router-link
              :to="{ path: '/playlist', query: { cat: tag } }"
              class="tag"
              v-for="(tag, index) in playlistInfo.tags"
              :key="index"
              >#{{ tag }}</router-link
            >
          </div>
        </div>
        <div class="cover-digital">
          <span class="cover-playCount"
            ><i class="iconfont icon-playnum"></i> {{ $utils.formartNum(playlistInfo.playCount) }}次</span
          >
          <span class="cover-collect"
            ><i class="iconfont icon-collect"></i> {{ $utils.formartNum(playlistInfo.subscribedCount) }}</span
          >
          <span class="cover-comment"
            ><i class="iconfont icon-comment"></i> {{ $utils.formartNum(playlistInfo.commentCount) }}</span
          >
        </div>
        <div class="cover-desc">
          <h5>
            歌单简介
            <em class="desc-close" v-if="isShowDesc" @click="isShowDesc = false">
              <i class="iconfont icon-closed"></i>
            </em>
          </h5>
          <p v-html="playlistInfo.description" @click="showAllDesc"></p>
          <pre class="cover-desc-all" v-if="isShowDesc">
					{{ playlistInfo.description }}
					</pre
          >
        </div>
      </div>
    </div>
    <div class="song-main">
      <div class="song-header">
        <h4>
          歌曲列表 <em>{{ songListTotal + '首歌' }}</em>
        </h4>
        <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
        <span :class="['collect', playlistInfo.subscribed ? 'active' : '']" @click="subPlayList(playlistInfo)"
          ><i :class="['iconfont', 'icon-collect' + (playlistInfo.subscribed ? '-active' : '')]"></i>
          {{ playlistInfo.subscribed ? '已收藏' : '收藏' }}</span
        >
      </div>
      <template v-if="songListLoading">
        <Loading />
      </template>
      <template v-else>
        <SongList
          :songList="songList"
          :stripe="true"
          :currentPage="songListPage"
          :pageSize="songListSize"
          :total="songListTotal"
          @update="updateSongList"
        />
        <div class="showAllSongsTips" v-if="!isLogin">
          <span @click="loginDialog">登录后查看更多内容</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, toRefs, watchEffect, computed } from 'vue'

import { useStore } from 'vuex'
import Loading from '@/components/Loading.vue'
import SongList from '@/components/SongList.vue'

const { proxy } = getCurrentInstance()

const store = useStore()

const props = defineProps({
  playlistId: {
    type: String,
  },
})

const info = reactive({
  playlistInfo: {},
  subscribers: [],
  isShowDesc: false,
  songList: [],
  songListPage: 1,
  songListSize: 20,
  songListTotal: 0,
  songListLoading: true,
})
const {
  playlistInfo,
  subscribers,
  isShowDesc,
  songList,
  songListPage,
  songListSize,
  songListTotal,
  songListLoading,
} = toRefs(info)

const isLogin = computed(() => store.getters.isLogin)

const getPlaylistDetail = async (params) => {
  info.songListLoading = true
  const { data: res } = await proxy.$http.playlistdetail(params)
  console.log('数据请求失败>>>>>', res)

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败>>>>>')
  }

  info.playlistInfo = res.playlist
  info.subscribers = res.playlist.subscribers
  info.songListTotal = res.playlist.trackCount

  getAllSongs({ id: props.playlistId, limit: info.songListSize })

  info.songListLoading = false
}

const getAllSongs = async (params) => {
  const { data: res } = await proxy.$http.playlistTrackAll(params)
  console.log(res)
  info.songList = proxy.$utils.formatSongs(res.songs, res.privileges)
}

const showAllDesc = () => {
  if (info.playlistInfo.description.length > 120) {
    info.isShowDesc = !info.isShowDesc
  }
}
const playAllSongs = () => {
  store.dispatch('playAll', {
    list: info.songList,
  })
  store.commit('SET_PLAYLISTTIPS', true)
}

// 收藏、取消歌单
const subPlayList = async (item) => {
  const { data: res } = await proxy.$http.subPlayList({ id: item.id, t: item.subscribed ? 2 : 1 })

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.playlistInfo.subscribed = !info.details.subscribed
}

const updateSongList = (page) => {
  console.log(page)
  const offset = (page - 1) * info.size
  getAllSongs({ id: info.pId, limit: info.size, offset: offset })
}

watchEffect(() => {
  console.log('props.playlistId:', props.playlistId)
  props.playlistId !== '0' && getPlaylistDetail({ id: props.playlistId, s: 8 })
})
</script>
<style lang="less" scoped>
.cover {
  display: flex;
  .cover-img {
    width: 250px;
    height: 250px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  }
  .cover-info {
    flex: 1;
    padding: 20px;
    margin-left: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

    .cover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cover-title {
        flex: 1;
        font-size: 24px;
        font-weight: bold;
        height: 34px;
        line-height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .cover-collect-author {
        width: 200px;
        text-align: right;
        .collect-author {
          position: relative;
          display: inline-block;
          width: 25px;
          height: 25px;
          border-radius: 100%;
          overflow: hidden;
          margin: 3px 0 0 -15px;
          border: 1px solid #fff;
          vertical-align: top;

          &:hover {
            z-index: 1;
            border: 1px solid var(--color-text-height);
          }
        }
      }
    }

    .cover-author-tags {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cover-author {
        padding: 15px 0 10px;

        .cover-avatar {
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 100%;
          vertical-align: top;
        }

        .cover-name,
        .cover-date {
          display: inline-block;
          padding: 0 10px;
          line-height: 32px;
        }

        .cover-date {
          color: var(--color-text);
        }
      }
      .cover-tags {
        .tag {
          display: inline-block;
          margin-right: 5px;
          font-size: 12px;
          color: var(--color-text-height);
        }
      }
    }
    .cover-digital {
      .cover-playCount,
      .cover-collect,
      .cover-comment {
        display: inline-block;
        padding: 0 20px 5px 0;
        line-height: 16px;
        font-size: 14px;
        color: var(--color-text);

        i {
          vertical-align: top;
        }
      }
    }
    .cover-desc {
      position: relative;

      h5 {
        padding: 30px 0 5px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
      }

      .desc-close {
        position: absolute;
        top: 30px;
        right: 0;
        cursor: pointer;
      }

      p {
        line-height: 22px;
        font-size: 14px;
        color: var(--color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        cursor: pointer;
      }

      .cover-desc-all {
        position: absolute;
        top: 70px;
        left: 10px;
        z-index: 1;
        width: calc(~'100% - 20px');
        padding: 10px;
        margin: -10px;
        max-height: 250px;
        line-height: 22px;
        font-size: 14px;
        white-space: pre-line;
        font-family: inherit;
        color: var(--color-text);
        background: #fff;
        overflow-y: scroll;
        box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
      }
    }
  }
}
.song-main {
	position: relative;
  padding: 0 20px;
  margin-top: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);
  .song-header {
    display: flex;
    padding: 30px 0 10px;

    h4 {
      flex: 1;
      font-size: 20px;
      line-height: 40px;

      em {
        display: inline-block;
        padding-left: 10px;
        font-size: 12px;
        line-height: 14px;
        font-style: normal;
        font-weight: normal;
        color: #666;
        vertical-align: baseline;
      }
    }

    span {
      display: flex;
      line-height: 16px;
      align-items: center;
      justify-content: center;
      border-radius: 50px;
      padding: 7px 20px;
      cursor: pointer;
      margin: 5px 0 5px 15px;
      transition: all 0.4s;
      background: #f0f0f0;
      color: #333;

      i {
        margin-right: 3px;
      }
    }

    .play-all {
      color: #fff;
      background: var(--color-text-height);

      i {
        color: #fff;
      }
    }

    .collect.active,
    .collect.active i {
      color: var(--color-text-height);
    }
  }
}
</style>
