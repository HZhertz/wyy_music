<template>
  <div class="search">
    <el-select
      v-model="keyVal"
      class="keyVal"
      clearable
      filterable
      placeholder="请输入歌名、歌词、歌手或专辑"
      remote
      :remote-method="remoteMethod"
      :fit-input-width="true"
      :loading="loading"
      loading-text="搜索中..."
      @focus="handleFocus"
    >
      <!-- 搜索框为空显示热门搜索 -->
      <div class="hot-search" v-if="!keyVal">
        <h5>热门搜索</h5>
        <el-option
          v-for="(item, index) in serachHot"
          :key="index"
          :label="item.first"
          :value="item.first"
          @click="jumpSearch(item)"
        >
          <span :class="[index < 3 ? 'top-' + index : '']">{{ index + 1 + '.' }}</span>
          {{ item.first }}
        </el-option>
      </div>
      <!-- 搜索框有值显示搜索联想 -->
      <el-option-group
        v-else
        v-for="list in suggestInfo"
        :key="listType[list.label]"
        :label="listType[list.label]"
        class="aaa"
      >
        <el-option
          v-for="(item, index) in list.info"
          :key="list.label + index"
          :label="item.name"
          :value="list.label + item.name"
          class="item"
          @click="jumpPage(item, list.label)"
        >
          {{ item.name }}
          <!-- 歌曲artists为一个数组/可能多个作者 -->
          <template v-if="list.label === 'songs'">
            -
            <span class="artists" v-for="(a, i) in item.artists" :key="i">{{
              (i !== 0 ? ' / ' : '') + a.name
            }}</span>
          </template>
          <!-- 专辑artists为一个对象/一个作者 -->
          <template v-else-if="list.label === 'albums'">
            - <span class="artists">{{ item.artist.name }}</span>
          </template>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const info = reactive({
  keyVal: '',
  serachHot: [],
  suggestInfo: [],
  loading: false,
  listType: {
    songs: '单曲',
    artists: '歌手',
    albums: '专辑',
    playlists: '歌单',
  },
})
const { keyVal, serachHot, suggestInfo, loading, listType } = toRefs(info)

onMounted(() => {
  getSearchHot()
})

// 热门搜索
const getSearchHot = async () => {
  const { data: res } = await proxy.$http.serachHot()
  // console.log('serachHotResponse:', res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  info.serachHot = res.result.hots
}

// el - select API 参数为当前输入值
const remoteMethod = (query) => {
  if (query) {
    // keyVal.value = query 写在分支外会导致获取焦点时将keyVal赋为空
    keyVal.value = query
    loading.value = true
    suggestInfo.value = []
    getSerachSuggest()
  } else if (keyVal.value) {
    loading.value = true
    suggestInfo.value = []
    getSerachSuggest()
  }
}

//获取焦点时，搜索框为空显示热门搜索，不为空发起请求显示搜索联想
const handleFocus = () => {
  if (keyVal.value) {
    loading.value = true
    suggestInfo.value = []
    getSerachSuggest()
  }
}
watch(keyVal, (newValue, oldValue) => {
  console.log('keyVal changed from', oldValue, 'to', newValue)
})

// 搜索联想
const getSerachSuggest = async () => {
  const { data: res } = await proxy.$http.serachSuggest({ keywords: keyVal.value })
  console.log('serachSuggestResponse:', res)
  loading.value = false
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  if (res.result.order) {
    suggestInfo.value = res.result.order.map((item) => {
      return {
        label: item,
        info: res.result[item],
      }
    })
    console.log('suggestInfo.value:', suggestInfo.value)
  }
}

// 默认热门搜索列表，点击后台跳转到搜索结果页面
const jumpSearch = (item) => {
  console.log('item.first', item.first)
  keyVal.value = item.first
  if (item.first === route.query.key) {
    return
  }
  router.push({ path: '/search', query: { key: item.first } })
}

// 搜索建议列表，点击后跳转到相对应的落地页
const jumpPage = (item, type) => {
  console.log('jumpPagekeyVal.value:', keyVal.value)
  switch (type) {
    case 'songs':
      router.push({ path: '/song', query: { id: item.id } })
      break
    case 'artists':
      router.push({ path: '/artist/detail', query: { id: item.id } })
      break
    case 'albums':
      router.push({ path: '/album', query: { id: item.id } })
      break
    case 'playlists':
      router.push({ path: '/playlist/detail', query: { id: item.id } })
      break
  }
}
</script>
<style></style>
<style lang="less" scoped>
:deep(.el-select__wrapper) {
  box-shadow: none;
  &.is-focused {
    box-shadow: 0 0 0 1px var(--color-text-height) inset;
  }
  &.is-hovering:not(.is-focused) {
    box-shadow: none;
  }
}
:deep(.el-select-dropdown__wrap) {
  max-height: 800px;
}
.search {
  position: relative;
  display: flex;
  text-align: right;
  align-items: center;
  border-bottom: 1px solid #999;
  background: #fff;

  .keyVal {
    width: 250px;
    border: 0;
  }
}
.hot-search {
  h5 {
    padding: 5px 0 5px 20px;
    font-size: 18px;
  }

  .top-0 {
    font-weight: bold;
    color: rgba(255, 0, 0, 1);
  }

  .top-1 {
    font-weight: bold;
    color: rgba(255, 0, 0, 0.6);
  }

  .top-2 {
    font-weight: bold;
    color: rgba(255, 0, 0, 0.4);
  }
}

.item {
  padding-right: 20px;

  .artists {
    font-size: 12px;
    color: var(--color-text);
  }

  &.selected {
    color: var(--color-text-height);

    .artists {
      color: var(--color-text-height);
    }
  }
}
</style>
