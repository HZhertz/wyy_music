<template>
  <div class="playlist">
    <div class="filter">
      <div class="filter-item" v-for="(item, index) in categories" :key="index">
        <div class="filter-title">{{ item.name }}</div>
        <div class="filter-box">
          <span
            :class="['item-box', curType === sub.name ? 'active' : '']"
            v-for="sub in item.children.slice(0, 8)"
            :key="sub.name"
            ><em @click="selectType(sub)">{{ sub.name }}</em></span
          >

          <el-popover :width="'auto'" trigger="click">
            <template #reference>
              <span :class="moreSty(index)" v-if="item.children.length > 9"
                ><em>{{ moreTxt[index] ? curType : '更多' }}<i class="iconfont icon-arrow"></i></em
              ></span>
              <span v-else></span>
            </template>
            <div class="filter-drop">
              <span
                :class="['item-box', curType === sub.name ? 'active' : '']"
                v-for="sub in item.children.slice(9)"
                :key="sub.name"
                ><em @click="selectType(sub, index)">{{ sub.name }}</em></span
              >
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="list-container">
      <div class="list-head">
        <h2>
          {{ curType }}
          <em v-if="curType !== allList.name" class="filter-close" @click="closed"
            ><i class="iconfont icon-closed"></i
          ></em>
        </h2>
        <div class="type">
          <span :class="params.order === 'hot' ? 'active' : ''" @click="selectOrder('hot')">热门</span>
          <span :class="params.order === 'new' ? 'active' : ''" @click="selectOrder('new')">最新</span>
        </div>
      </div>
      <div
        class="wrapper infinite-list"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="disabled"
        infinite-scroll-distance="100"
      >
        <PlayList :playList="playlist_list" :loading="playlist_loading" :total="playlist_count" />
        <template v-if="playlist_loading">
          <Loading />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, reactive, toRefs, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlayList from '@/components/playlist/PlayList.vue'
import Loading from '@/components/Loading.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const cat = route.query.cat
const info = reactive({
  sub: [],
  categories: [],
  curType: '全部歌单',
  moreTxt: {},
  allList: {
    name: '全部歌单',
  },
  playlist_list: [],
  playlist_count: 24,
  playlist_loading: true,
  more: true,

  params: {
    order: 'hot',
    cat: cat,
    limit: 48,
    offset: 0,
  },
})
const {
  sub,
  categories,
  curType,
  moreTxt,
  allList,
  playlist_list,
  playlist_count,
  playlist_loading,
  more,

  params,
} = toRefs(info)

const getCatlist = async () => {
  const { data: res } = await proxy.$http.catlist()
  info.sub = res.sub

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  for (const k in res.categories) {
    const params = { name: res.categories[k] }

    params.children = info.sub.filter((subItem) => {
      return subItem.category === Number(k)
    })
    info.categories.push(params)
  }

  info.curType = cat ? cat : res.all.name
  info.allList = res.all
  getMoreTxt()
}
const getMoreTxt = () => {
  // 查询当前显示的歌单分类详情，如：全部歌单、华语
  const itemInfo = info.sub.find((subItem) => {
    return subItem.name === info.curType
  })
  info.moreTxt = {}
  if (itemInfo) {
    // 若有歌单分类，且分类歌单的索引在更多里面，则渲染moreText数据
    const index = info.categories[itemInfo.category].children.indexOf(itemInfo)
    index >= 8 && (info.moreTxt[itemInfo.category] = itemInfo)
  }
}
const getPlayList = async (params) => {
  const { data: res } = await proxy.$http.playList(params)

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  console.log(res)

  info.playlist_list = info.params.offset !== 0 ? [...info.playlist_list, ...res.playlists] : res.playlists
  info.more = res.more
  info.playlist_loading = false
}
const disabled = computed(() => info.playlist_loading || !info.more)

onMounted(() => {
  getCatlist()
  getPlayList(info.params)
})

const selectType = (item) => {
  router.push({ path: 'playlist', query: { cat: item.name, order: info.params.order } })
}

const closed = () => {
  router.push({ path: 'playlist' })
}

const selectOrder = (type) => {
  router.push({ path: 'playlist', query: { cat: info.params.cat, order: type } })
}

const loadMore = () => {
  console.log(info.params)

  info.params.offset = info.playlist_list.length
}

watch(
  () => route.query,
  (newVal, oldVal) => {
    const { cat, order } = newVal

    info.curType = cat || info.allList.name
    info.params = Object.assign(
      {},
      { order: 'hot', cat: '', limit: 50, offset: 0 },
      { cat: cat || '', order: order || 'hot' }
    )
    getMoreTxt()
  }
)

watch(
  () => info.params,
  (newVal, oldVal) => {
    if (newVal.cat !== oldVal.cat) {
      info.playlist_list = []
    }
    getPlayList(newVal)
  },
  {
    deep: true, // 深度监听
  }
)

const moreSty = computed(() => {
  return (index) => {
    return ['item-box', 'filter-more', info.moreTxt[index] ? 'active' : '']
  }
})
</script>
<style lang="less" scoped>
.wrapper {
  min-height: 500px;
}
.playlist {
  padding-top: 40px;
}
.filter {
  display: flex;
  min-width: 540px;
  padding: 20px;
  margin-bottom: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

  .filter-item {
    flex: 1;
    border-left: 1px solid #f5f5f5;
    padding-left: 35px;

    .filter-title {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .item-box {
      display: inline-block;
      width: 44px;
      margin: 2px;
      vertical-align: top;

      em {
        display: inline-block;
        font-style: normal;
        font-size: 14px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
      }

      &.active {
        em {
          color: #fff;
          font-style: normal;
          background: var(--color-text-height);
        }
      }
    }

    .filter-more {
      width: 50px;

      &.active {
        em {
          width: 40px;
          overflow: hidden;
          height: 26px;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: top;
        }
      }
    }

    &:first-child {
      flex: 1;
      border: 0;
      padding-left: 0;
    }
  }
}

.filter-drop {
  .item-box {
    display: inline-block;
    line-height: 26px;
    padding: 0 15px;
    font-size: 14px;

    em {
      display: inline-block;
      font-style: normal;
      cursor: pointer;
    }

    &.active {
      em {
        padding: 0 5px;
        margin: 0 -5px;
        color: #fff;
        font-style: normal;
        background: var(--color-text);
      }
    }
  }
}

.list-head {
  display: flex;
  padding: 15px 0;

  h2 {
    font-size: 24px;
    line-height: 30px;
  }

  .filter-close {
    display: inline-block;
    line-height: 16px;
    vertical-align: top;
    cursor: pointer;
  }

  .type {
    flex: 1;
    padding: 5px 40px;

    span {
      position: relative;
      z-index: 9;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      margin-right: 34px;
      font-weight: 300;
      color: #333;
      cursor: pointer;

      &.active {
        font-weight: 600;
        color: #000;

        &::after {
          position: absolute;
          content: '';
          left: 0;
          bottom: 1px;
          width: 100%;
          height: 6px;
          background: var(--color-text-height);
          z-index: -1;
        }
      }
    }
  }
}
</style>
