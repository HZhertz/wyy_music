<template>
  <el-skeleton :loading="loading" animated :throttle="500" :count="size">
    <template #template>
      <el-skeleton-item class="ske-img" variant="image" />
    </template>
    <template #default>
      <div class="artist-list">
        <div class="item" v-for="item in artistList">
          <ArtistItem :item="item" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>
<script setup>
import ArtistItem from './ArtistItem.vue'

const props = defineProps({
  artistList: {
    // 歌手信息
    type: Object,
    required: true,
  },
  // mini | normal
  styType: {
    type: String,
    default: 'mini',
  },
  size: {
    type: Number,
  },
  loading: {
    type: Boolean,
  },
})
</script>
<style lang="less" scoped>
.artist-list {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  .item {
    width: 90px;
    height: 90px;
    margin: 10px 5px;
    border-radius: 4px;
  }
}

.el-skeleton {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-around;
  height: 340px;

  .ske-img {
    width: 100px;
    height: 100px;
  }
}
</style>
