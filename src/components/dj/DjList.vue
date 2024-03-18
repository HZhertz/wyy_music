<template>
  <el-skeleton :loading="loading" animated :throttle="500" :count="count">
    <template #template>
      <div class="ske-item">
        <el-skeleton-item class="ske-img" variant="image" />
        <div class="ske-info">
          <el-skeleton-item variant="h3" class="ske-name" />
          <el-skeleton-item variant="h3" class="ske-rcmdtext" style="width: 50%" />
          <el-skeleton-item variant="text" class="ske-count" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="dj">
        <div class="item" v-for="item in list">
          <DjItem :item="item" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import DjItem from './DjItem.vue'

const { proxy } = getCurrentInstance()

// 热门电台
const info = reactive({
  list: [],
  params: { limit: 6 },
  count: 6,
  loading: true,
})
const { list, params, count, loading } = toRefs(info)

onMounted(() => {
  getHotDj(params.value)
})

// 获取热门电台
const getHotDj = async (params) => {
  const { data: res } = await proxy.$http.getHotDj(params)

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  list.value = res.djRadios
  loading.value = false
}
</script>
<style lang="less" scoped>
.dj {
  display: flex;
  flex-wrap: wrap;
  margin-right: -20px;

  .item {
    margin: 5px;
  }
}

.el-skeleton {
  width: auto;
  display: block;
  flex-wrap: wrap;
  font-size: 0;

  .ske-item {
    display: inline-flex;
    width: 50%;
    margin-bottom: 20px;
  }

  .ske-img {
    width: 120px;
    height: 120px;
    border-radius: 4px;
    overflow: hidden;
  }

  .ske-info {
    flex: 1;
    padding: 10px 0;
    margin: 0 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }
}
</style>
