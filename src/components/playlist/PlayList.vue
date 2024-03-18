<template>
  <el-skeleton :loading="loading" animated :count="total" :throttle="500">
    <template #template>
      <div class="item">
        <el-skeleton-item class="ske-img" variant="image" />
        <div class="ske-info">
          <el-skeleton-item variant="h3" class="ske-name" />
          <el-skeleton-item variant="h3" class="ske-name" style="width: 50%" />
          <div class="ske-tags">
            <el-skeleton-item variant="text" />
            <el-skeleton-item variant="text" />
            <el-skeleton-item variant="text" />
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <div class="playlist">
        <div class="item" v-for="item in playList" :key="item.id">
          <PlayListItem :item="item" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>
<script setup>
import PlayListItem from './PlayListItem.vue'

const props = defineProps({
  playList: {
    // 歌曲列表
    type: Array,
    required: true,
  },

  // 前端分页 1| 后端分页2 | 无限滚动0
  paginationType: {
    type: Number,
    default: 1,
  },
  offset: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 20,
  },
  total: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  isShowPag: {
    type: Boolean,
    default: true,
  },
})
</script>
<style lang="less" scoped>
.playlist {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  min-width: 640px;
}

.el-skeleton {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  box-sizing: border-box;
  .item {
    position: relative;
    width: 150px;
    padding: 20px;
  }
  .ske-img {
    width: 150px;
    height: 150px;
    z-index: 3;
    border-radius: 4px;
  }

  .ske-info {
    padding-top: 15px;
  }

  .ske-name {
    line-height: 16px;
    margin: 3px 0;
  }

  .ske-tags {
    display: flex;
    padding: 5px 0;

    * {
      width: 10%;
      margin-right: 10px;
    }
  }
}
</style>
