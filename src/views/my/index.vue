<template>
  <div class="my" v-if="isLogin">
    <div class="my_side">
      <el-scrollbar height="610px">
        <el-menu
          router
          active-text-color="#2d2d2d"
          background-color="#fff"
          text-color="#2d2d2d"
          class="el-menu-vertical"
          :default-active="defaultActive"
          :default-openeds="['1', '2']"
        >
          <el-sub-menu index="1">
            <template #title>
              <span>创建的歌单({{ crePlaylistTotal }})</span>
            </template>
            <el-menu-item :index="'/my?playlistId=' + item.id" v-for="item in crePlaylist">
              <div class="playlist_item">
                <img :src="item.coverImgUrl" alt="" />
                <div class="info">
                  <span :title="item.name">{{ item.name }}</span>
                  <span>{{ item.trackCount }}首</span>
                </div>
              </div>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <span>收藏的歌单({{ subPlaylistTotal }})</span>
            </template>
            <el-menu-item :index="'/my?playlistId=' + item.id" v-for="item in subPlaylist">
              <div class="playlist_item">
                <img width="80px" height="80px" :src="item.coverImgUrl" alt="" />
                <div class="info">
                  <span :title="item.name">{{ item.name }}</span>
                  <span>{{ item.trackCount }}首 by {{ item.creator.nickname }}</span>
                </div>
              </div>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="my_main">
      <PlayListMain :playlistId="pId" />
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, toRefs, computed, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import PlayListMain from '@/components/playlist/PlayListMain.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()

const info = reactive({
  pId: '0',
  crePlaylist: [],
  crePlaylistTotal: 0,
  subPlaylist: [],
  subPlaylistTotal: 0,
  firstNonEmptyPlaylistId: 0,
})
const { pId, crePlaylist, crePlaylistTotal, subPlaylist, subPlaylistTotal } = toRefs(info)

const isLogin = computed(() => store.getters.isLogin)
const uId = computed(() => store.getters.userInfo.userId)
const defaultActive = computed(() => {
  return '/my?playlistId=' + route.query.playlistId || ''
})

const getUserPlaylist = async () => {
  const [{ data: playlistRes }, { data: subcountRes }] = await Promise.all([
    proxy.$http.getUserPlaylist({ uid: uId.value }),
    proxy.$http.getUserSubcount(),
  ])
  info.firstNonEmptyPlaylistId = playlistRes.playlist.find((item) => item.trackCount !== 0)?.id || 0
  info.crePlaylist = playlistRes.playlist.filter((item) => !item.subscribed)
  info.subPlaylist = playlistRes.playlist.filter((item) => item.subscribed)
  info.crePlaylistTotal = subcountRes.createdPlaylistCount
  info.subPlaylistTotal = subcountRes.subPlaylistCount
}

onMounted(async () => {
  await getUserPlaylist()
  !route.query.playlistId &&
    (await router.push({ path: 'my', query: { playlistId: info.firstNonEmptyPlaylistId } }))
  info.pId = route.query.playlistId
})

onBeforeRouteUpdate((to) => {
  info.songList = []
  info.total = 0
  info.pId = to.query.playlistId
})
</script>
<style lang="less" scoped>
.my {
  display: flex;
  .my_side {
    position: fixed;

    width: 300px;
    height: 610px;
    // padding-bottom: 25px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

    .playlist_item {
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
  .my_main {
    flex: 1;
    padding-bottom: 45px;
    padding-left: 320px;
  }
}

:deep(.el-sub-menu__title) {
  height: 60px;
}
:deep(.el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item) {
  padding: 0;
}
:deep(.el-sub-menu .el-menu-item) {
  height: 100px;
  line-height: 1.5;
}
:deep(.el-menu-item.is-active) {
  background-color: #f0f0f0;
}
</style>
