<template>
  <el-skeleton :loading="loading" animated :count="size" :throttle="500">
    <template #template>
      <div class="item">
        <el-skeleton-item class="ske-img" variant="image" />
        <div class="ske-info">
          <el-skeleton-item variant="h3" class="ske-name" />
          <el-skeleton-item variant="h3" class="ske-name" style="width: 50%" />
          <el-skeleton-item variant="text" class="ske-txt" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="album">
        <div class="album-item" v-for="item in albumList">
          <AlbumItem :item="item" :height="90" />
        </div>
      </div>
      <el-pagination
        :current-page="page"
        :page-size="size"
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
        hide-on-single-page
      >
      </el-pagination>
    </template>
  </el-skeleton>
</template>
<script setup>
import { computed } from 'vue'
import AlbumItem from './AlbumItem.vue'

const props = defineProps({
  albumList: {
    type: Array,
    required: true,
  },
  height: {
    type: String,
    default: '100',
  },
  // 前端分页 1|后端分页 2|滚动加载 0
  paginaType: {
    type: Number,
    default: 1,
  },
  page: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 12,
  },
  total: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update'])

const currentChange = (page) => {
  emit('update', page)
}
</script>
<style scoped lang="less">
.album {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;

  .album-item {
    margin: 4px 6px;
  }
}

.el-skeleton {
  display: flex;
  width: auto;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: left;
  padding-bottom: 40px;
  margin: 0 -10px;
  font-size: 0;

  .item {
    display: flex;
    flex: 25%;
    max-width: calc(100% / 3 - 20px);
    margin: 10px 5px 0;
  }

  .ske-img {
    display: block;
    position: relative;
    width: 120px;
    height: 120px;
    line-height: 150px;
    text-align: center;
  }

  .ske-info {
    position: relative;
    flex: 1;
    margin: 5% 0 0 10%;
    overflow: hidden;
  }

  .ske-name {
    margin: 5px 0;
  }

  .ske-txt {
    display: block;
    margin-top: 10px;
    width: 10%;
  }
}
</style>
