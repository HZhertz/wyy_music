<template>
  <div class="singer">
    <div class="singer-main">
      <div class="singer-header">
        <div class="singer-avatar">
          <el-image :src="artistAvatar" class="avatar_img">
            <template #placeholder>
              <div class="image-slot">
                <i class="iconfont icon-placeholder"></i>
              </div>
            </template>
          </el-image>
        </div>
        <div class="singer-info">
          <div class="name">{{ artistName }}</div>
          <div class="tags">{{ artistTags }}</div>
          <div class="digital">粉丝数：{{ $utils.formartNum(followCount) }}</div>
          <el-button class="follow-btn" :color="isFollow ? '#909090' : '#ff641e'" round size="large">
            {{ isFollow ? '已关注' : '关注' }}
          </el-button>
        </div>
      </div>
      <el-tabs class="list" type="border-card" active-color="#fff" @tab-change="handleTabChange">
        <el-tab-pane label="热门">
          <SongList :songList="hotSongs" :stripe="true" />
        </el-tab-pane>
        <el-tab-pane :label="'歌曲' + songTotal">
          <SongList
            :songList="allSongs"
            :stripe="true"
            :currentPage="currentPage"
            :pageSize="pageSize"
            :total="songTotal"
            @update="updateSongList"
          />
        </el-tab-pane>
        <el-tab-pane :label="'专辑' + albumTotal">
          <AlbumList
            :albumList="allAlbums"
            :loading="albumLoading"
            :page="albumPage"
            :size="albumSize"
            :total="albumTotal"
            :height="94"
            @update="updateAlbumList"
          />
        </el-tab-pane>
        <el-tab-pane :label="'视频' + mvTotal">
          <MvList
            :mvList="allMv"
            :loading="mvLoading"
            :page="mvPage"
            :size="mvSize"
            :total="mvTotal"
            @update="updateMvList"
          />
        </el-tab-pane>
        <el-tab-pane label="详情">
          <ArtistDesc :descInfo="artistDesc" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="singer-side">
      <div class="simi-artist">
        <h3 class="simi-artist-title">相似歌手</h3>
        <div class="simi-artist-box">
          <router-link
            class="simi-artist-item"
            :to="{ path: '/artist/detail', query: { id: item.id } }"
            v-for="item in simiArtist"
          >
            <div class="faceImg">
              <el-image class="item-img" :src="item.picUrl + '?param=80y80'" :title="item.name">
                <div slot="placeholder" class="image-slot">
                  <i class="iconfont icon-placeholder"></i>
                </div>
              </el-image>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import SongList from '@/components/SongList.vue'
import AlbumList from '@/components/album/AlbumList.vue'
import MvList from '@/components/mv/MvList.vue'
import ArtistDesc from './components/ArtistDesc.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()

const info = reactive({
  sId: '',
  artistName: '',
  artistAvatar: '',
  artistTags: '',
  followCount: 0,
  isFollow: false,
  hotSongs: [],
  allSongs: [],
  currentPage: 1,
  pageSize: 20,
  songTotal: 0,
  allAlbums: [],
  albumLoading: true,
  albumPage: 1,
  albumSize: 12,
  albumTotal: 0,
  allMv: [],
  mvLoading: true,
  mvPage: 1,
  mvSize: 12,
  mvTotal: 0,
  artistDesc: {},
  simiArtist: [],
})
const {
  artistName,
  artistAvatar,
  artistTags,
  followCount,
  isFollow,
  hotSongs,
  allSongs,
  currentPage,
  pageSize,
  songTotal,
  allAlbums,
  albumLoading,
  albumPage,
  albumSize,
  albumTotal,
  allMv,
  mvLoading,
  mvPage,
  mvSize,
  mvTotal,
  artistDesc,
  simiArtist,
} = toRefs(info)

const getArtistDetail = async () => {
  const [{ data: detailRes }, { data: followCountRes }] = await Promise.all([
    proxy.$http.artistDetail({ id: info.sId }),
    proxy.$http.artistFollowCount({ id: info.sId }),
  ])

  if (detailRes.code !== 200 || followCountRes.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  console.log('detailRes.data:', detailRes.data)
  info.artistName = detailRes.data.artist.name
  info.artistAvatar = detailRes.data.artist.avatar
  info.artistTags = detailRes.data.identify?.imageDesc
  info.songTotal = detailRes.data.artist.musicSize
  info.albumTotal = detailRes.data.artist.albumSize
  info.mvTotal = detailRes.data.artist.mvSize
  info.followCount = followCountRes.data.fansCnt
  info.isFollow = followCountRes.data.isFollow
}
const getHotSongs = async () => {
  const { data: res } = await proxy.$http.artistHotSong({ id: info.sId })
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.hotSongs = res.songs.map((item) => {
    const [result] = proxy.$utils.formatSongs([item], [item.privilege])
    return result
  })
}
const getAllSongs = async (offset = 0) => {
  const { data: res } = await proxy.$http.artistAllSong({
    id: info.sId,
    limit: info.pageSize,
    offset: offset,
  })
  console.log(res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.allSongs = res.songs.map((item) => {
    const [result] = proxy.$utils.formatSongs([item], [item.privilege])
    return result
  })
}
const getAllAlbum = async (offset = 0) => {
  const { data: res } = await proxy.$http.artistAlbum({
    id: info.sId,
    limit: info.albumSize,
    offset: offset,
  })
  console.log(res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.allAlbums = res.hotAlbums
  info.albumLoading = false
}
const getAllMv = async (offset = 0) => {
  const { data: res } = await proxy.$http.artistMv({
    id: info.sId,
    limit: info.mvSize,
    offset: offset,
  })
  console.log(res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.allMv = res.mvs
  info.mvLoading = false
}
const getArtistDesc = async () => {
  const { data: res } = await proxy.$http.artistDesc({
    id: info.sId,
  })
  console.log(res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.artistDesc = res
}
const getSimiArtist = async () => {
  const { data: res } = await proxy.$http.simiArtist({
    id: info.sId,
  })
  console.log(res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.simiArtist = res.artists.slice(0, 9)
}

const handleTabChange = (name) => {
  switch (name) {
    case '1':
      !info.allSongs.length && getAllSongs()
      break
    case '2':
      !info.allAlbums.length && getAllAlbum()
      break
    case '3':
      !info.allMv.length && getAllMv()
      break
    case '4':
      console.log(info.artistDesc.briefDesc)
      !info.artistDesc.briefDesc && getArtistDesc()
      break
    default:
      break
  }
}
const updateSongList = (page) => {
  info.currentPage = page
  const offset = (page - 1) * info.pageSize
  getAllSongs(offset)
}
const updateAlbumList = (page) => {
  info.albumPage = page
  const offset = (page - 1) * info.albumSize
  getAllAlbum(offset)
}
const updateMvList = (page) => {
  info.mvPage = page
  const offset = (page - 1) * info.mvSize
  getAllMv(offset)
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
  resetInfo()
  if (info.sId) {
    getArtistDetail()
    getHotSongs()
    getSimiArtist()
  }
}
const resetInfo = () => {
  info.allSongs = []
  info.currentPage = 1
  info.allAlbums = []
  info.albumLoading = true
  info.albumPage = 1
  info.allMv = []
  info.mvLoading = true
  info.mvPage = 1
  info.artistDesc = {}
  info.simiArtist = []
}
</script>
<style scoped lang="less">
.singer {
  display: flex;
  .singer-main {
    width: 860px;
  }
  .singer-side {
    flex: 1;
  }
}
.singer-header {
  display: flex;
  height: 300px;
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  overflow: hidden;
  .singer-avatar {
    width: 300px;
    .avatar_img {
      width: 250px;
      height: 250px;
      border-radius: 125px;
      margin: 25px;
      box-shadow: 0 20px 27px rgba(0, 0, 0, 0.185);
    }
  }
  .singer-info {
    margin: 50px 0 0 20px;
    .name {
      font-weight: 700;
      font-size: 32px;
      color: var(--color-text-main);
    }
    .tags {
      margin: 15px 0;
      height: 40px;
      color: var(--color-text);
    }
    .digital {
      margin: 20px 0;

      color: var(--color-text);
    }
    .follow-btn {
      width: 70px;
      color: var(--color-text-main);
    }
  }
  // span {
  //   display: block;
  //   width: 100%;
  //   height: 100%;
  //   position: relative;
  //   z-index: 5;
  //   background-position: center top;
  //   background-size: cover;
  //   background-attachment: fixed;
  // }

  // em {
  //   position: absolute;
  //   z-index: 9;
  //   display: block;
  //   width: 100%;
  //   height: 100%;
  //   -webkit-filter: blur(20px);
  //   -moz-filter: blur(20px);
  //   -ms-filter: blur(20px);
  //   -o-filter: blur(20px);
  //   filter: blur(20px);
  //   background-position: center top;
  //   background-size: cover;
  //   background-attachment: fixed;
  // }
}
.list {
  margin-top: 30px;
  border: 0px solid #000;
  border-top: 2px solid #efefef;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
}
:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  width: 110px;
  height: 50px;
  &.is-active,
  &:hover {
    color: var(--color-text-height);
  }
}

.simi-artist {
  width: 270px;
  height: 300px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  .simi-artist-title {
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
  .simi-artist-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: space-between;
    .item-img {
      margin-top: 10px;
      border-radius: 10px;
    }
  }
}
</style>
