<template>
  <div class="hot-artist">
    <el-carousel class="artist" height="auto" :interval="8000" arrow="never" indicator-position="outside">
      <el-carousel-item class="box" :key="index" v-for="(list, index) in lists">
        <ArtistList :artistList="list" :loading="loading" :size="count" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import ArtistList from '@/components/artist/ArtistList.vue'

const { proxy } = getCurrentInstance()

const info = reactive({
  lists: [],
  params: { limit: 36 },
  count: 12,
  loading: true,
})
const { lists, params, count, loading } = toRefs(info)

onMounted(() => {
  getArtists(info.params)
})

// 热门歌手
const getArtists = async (params) => {
  const { data: res } = await proxy.$http.topArtists(params)

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  lists.value = splitGroup(res.artists, count.value)
  loading.value = false
}

// 将数组变为二维数组
const splitGroup = (array, subGroupLength) => {
  let index = 0
  let newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }
  return newArray
}
</script>
<style lang="less" scoped>
.box {
  width: auto;
  height: auto;
}
</style>
