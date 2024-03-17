<template>
  <div class="playlist-item">
    <router-link :to="{ path: '/playlist/detail', query: { id: item.id } }" class="faceImg">
      <el-image :src="item.coverImgUrl" lazy>
        <template #placeholder>
          <div class="image-slot">
            <i class="iconfont icon-placeholder"></i>
          </div>
        </template>
      </el-image>
      <span class="playCount"
        ><i class="iconfont icon-playnum"></i><em>{{ $utils.formartNum(item.playCount) }}</em> /
        {{ item.trackCount + '首' }}</span
      >
    </router-link>
    <div class="info">
      <router-link :to="{ path: '/playlist/detail', query: { id: item.id } }" class="info_name"
        >{{ item.name }}
      </router-link>
      <div class="tags">
        <router-link
          :to="{ path: '/playlist', query: { cat: tag } }"
          class="tag"
          v-for="(tag, index) in item.tags"
          :key="index"
          >#{{ tag }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
  },
})
</script>
<style lang="less" scoped>
.playlist-item {
  width: 190px;
  padding: 20px;
  box-sizing: border-box;

  .faceImg {
    display: block;
    position: relative;
    padding-top: 100%;
    // height: 216px;

    &::after,
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      background-color: #d9d9d9;
      position: absolute;
      top: 0;
    }

    &::before {
      border: 1px solid #d6d6d6;
      right: -6px;
      -webkit-transform: scale(0.85);
      -ms-transform: scale(0.85);
      transform: scale(0.85);
      -webkit-transform-origin: 100% 50%;
      -ms-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
      z-index: 2;
      border-radius: 2px;
      transition: all 0.4s linear;
    }

    &::after {
      border: 1px solid #c4c4c4;
      right: -11px;
      -webkit-transform: scale(0.73);
      -ms-transform: scale(0.73);
      transform: scale(0.73);
      -webkit-transform-origin: 100% 50%;
      -ms-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
      z-index: 1;
      border-radius: 2px;
      opacity: 0.5;
      transition: all 0.4s linear 0.1s;
    }
  }

  .el-image {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    border-radius: 4px;
  }

  .playCount {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 4;
    font-size: 12px;
    display: block;
    // width: 60%;
    text-align: center;
    color: #fff;
    line-height: 30px;
    padding-right: 10px;
    border-radius: 0 4px 0 0;
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,000000+100&0+0,0.5+97 */
    background: -moz-linear-gradient(
      left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.5) 97%,
      rgba(0, 0, 0, 0.5) 100%
    ); /* FF3.6-15 */
    background: -webkit-linear-gradient(
      left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.5) 97%,
      rgba(0, 0, 0, 0.5) 100%
    ); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.5) 97%,
      rgba(0, 0, 0, 0.5) 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#80000000',GradientType=1 ); /* IE6-9 */

    .icon-playnum {
      color: #fff;
    }

    em {
      display: inline-block;
      padding-left: 5px;
      font-style: normal;
    }
  }

  &:hover {
    .faceImg {
      position: relative;

      &::after,
      &::before {
        background: #ff960080;
      }

      &::before {
        right: -8px;
      }

      &::after {
        right: -15px;
      }
    }

    .info_name {
      color: #000;
    }
  }

  .info_name {
    display: block;
    font-size: 16px;
    line-height: 22px;
    margin-top: 15px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  .tags {
    padding: 5px 0;

    .tag {
      padding-right: 5px;
      font-size: 12px;
      color: var(--color-text-height);
    }
  }
}
</style>
