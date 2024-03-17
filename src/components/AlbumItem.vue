<template>
  <router-link
    :to="{ path: '/album', query: { id: item.id } }"
    class="album-item"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <div class="faceImg" :style="{ width: height + 'px', height: height + 'px' }">
      <el-image :src="item.picUrl + '?param=120y120'">
        <div slot="placeholder" class="image-slot">
          <i class="iconfont icon-placeholder"></i>
        </div>
      </el-image>
    </div>
    <div class="info">
      <div class="album-type" :style="{ fontSize: albumTypeFontSize + 'px' }">{{ item.type }}</div>
      <div class="album-name" :style="{ fontSize: albumNameFontSize + 'px' }" v-if="item.name">
        {{ item.name }}
      </div>
      <div class="artist-name" :style="{ fontSize: artistNameFontSize + 'px' }" v-if="item.artist">
        {{ item.artist.name }}
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  item: Object,
  height: { type: Number, default: 100 },
})

const width = computed(() => {
  return props.height * 2.8
})
const albumTypeFontSize = computed(() => {
  return props.height / 8
})
const albumNameFontSize = computed(() => {
  return props.height / 6
})
const artistNameFontSize = computed(() => {
  return props.height / 7
})
</script>
<style lang="less" scoped>
.album-item {
  display: flex;
  border-radius: 4%;
  background: #f0f0f0;

  &:hover {
    .album-name {
      color: var(--color-text-height);
    }
  }
}

.faceImg {
  position: relative;

  .el-image {
    border-radius: 4%;
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -20%;
    width: 99%;
    height: 99%;
    background: url('@/assets/img/disc.png') no-repeat;
    background-size: contain;
    background-position: center;
    transition: all 0.4s linear;
  }

  &:hover {
    &::after {
      right: -25%;
      transform: rotate(90deg);
    }
  }
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .album-name {
    padding: 15% 10% 4% 20%;
    color: var(--color-text-main);
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .artist-name {
    padding-left: 20%;
    color: var(--color-text);
  }

  .album-type {
    position: absolute;
    top: 5%;
    right: -40%;
    width: 100%;
    line-height: 200%;
    transform: rotate(45deg);
    text-align: center;
    color: #fff;
    background-color: var(--color-text-height);
  }
}
</style>
