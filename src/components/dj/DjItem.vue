<template>
  <router-link :to="{ path: '/dj', query: { id: item.id } }" class="dj-item">
    <div class="faceImg">
      <el-image :src="item.picUrl + '?param=120y120'">
        <div slot="placeholder" class="image-slot">
          <i class="iconfont icon-placeholder"></i>
        </div>
      </el-image>
    </div>
    <div class="info">
      <div class="dj-name" v-if="item.name"><i class="iconfont icon-dj"></i>{{ item.name }}</div>
      <div class="dj-rcmdtext" v-if="item.rcmdtext">{{ item.rcmdtext }}</div>
      <div class="dj-count">
        <span>共{{ $utils.formartNum(item.programCount) }}期</span>
        <span>订阅{{ $utils.formartNum(item.subCount) }}次</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>
<style lang="less" scoped>
.dj-item {
  display: flex;

  width: 330px;

  height: 100px;
  border-radius: 4%;

  .faceImg {
    width: 100px;
    height: 100px;
    border-radius: 4%;
    overflow: hidden;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    padding: 5px 0;
    margin: 0 20px;
    border-bottom: 1px solid #eee;

    .dj-name,
    .icon-dj {
      padding-right: 10px;
      font-size: 18px;
      font-weight: bold;
      color: var(--color-text-main);
    }
    .dj-rcmdtext {
      width: 190px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;

      color: var(--color-text);
    }

    .dj-count {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
