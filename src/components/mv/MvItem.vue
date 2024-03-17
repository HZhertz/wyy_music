<template>
  <div class="albumItem">
    <router-link :to="{ path: '/mvlist/mv', query: { id: item.id } }" class="faceImg">
      <i class="iconfont icon-video-play"></i>
      <el-image :src="item.cover || item.imgurl" fit="cover">
        <div slot="placeholder" class="image-slot">
          <i class="iconfont icon-placeholder"></i>
        </div>
      </el-image>
    </router-link>
    <div class="info">
      <router-link :to="{ path: '/mvlist/mv', query: { id: item.id } }" class="mv-name">{{ item.name }}</router-link>
      <router-link :to="{ path: '/singer', query: { id: item.artistId } }" class="mv-author" v-if="!item.publishTime">{{
        item.artistName
      }}</router-link>
      <div class="mv-playCount"><i class="iconfont icon-mvlist"></i> {{ $utils.formartNum(item.playCount) }}</div>
      <div class="mv-time" v-if="item.publishTime">发布时间：{{ item.publishTime }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
})
</script>
<style lang="less" scoped>
.albumItem {
  width: 180px;
  margin: 10px;
  border-radius: 4px;

  &:hover {
    .el-image {
      transform: scale(1.1);
    }

    .icon-video-play {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.faceImg {
  display: block;
  position: relative;
  overflow: hidden;
}

.icon-video-play {
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  margin-top: -30px;
  font-size: 60px;
  text-align: center;
  color: #fff;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.4s linear;
  text-shadow: 2px 2px 10px #000;
}

.el-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 120px;
  border-radius: 4px;
  z-index: 2;
  transition: all 0.4s linear;
}

.info {
  position: relative;
  padding: 15px 0;

  .mv-name {
    display: block;
    font-size: 14px;
    text-overflow: ellipsis;
    height: 20px;
    overflow: hidden;
    white-space: nowrap;
  }

  .mv-author,
  .mv-playCount,
  .mv-time {
    display: block;
    line-height: 24px;
    font-size: 14px;
    color: #999;
  }

  .icon-video {
    font-size: 24px;
    color: #999;
    vertical-align: top;
  }
}
</style>
