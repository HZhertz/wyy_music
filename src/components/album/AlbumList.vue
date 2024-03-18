<template>
  <el-skeleton :loading="loading" animated :count="size" :throttle="500">
    <template #template>
      <div class="item" :style="{ width: width + 'px' }">
        <el-skeleton-item
          class="ske-img"
          variant="image"
          :style="{ width: height + 'px', height: height + 'px' }"
        />
        <div class="ske-info">
          <el-skeleton-item variant="h3" class="ske-name" />
          <el-skeleton-item variant="h3" class="ske-name" style="width: 50%" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="album">
        <div class="album_item" v-for="item in albumList">
          <AlbumItem :item="item" :height="height" />
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

const width = computed(() => {
  return props.height * 2.8
})
</script>
<style scoped lang="less">
.album {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;

  .album_item {
    margin: 4px 6px;
  }
}

.el-skeleton {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;

  .item {
    display: flex;
    // flex: 25%;
    border-radius: 4%;

    margin: 4px 6px;
  }

  .ske-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-evenly;
    position: relative;
    margin: 10px 0;
    overflow: hidden;
  }

  .ske-name {
    // height: 10px;
    margin: 5px;
  }
}
</style>
