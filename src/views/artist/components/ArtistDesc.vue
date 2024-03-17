<template>
  <div class="artist-desc">
    <h3>简介</h3>
    <p class="briefDesc">
      {{ descInfo.briefDesc }}
    </p>
    <div class="introduction">
      <div class="introduction-item" v-for="(item, index) in descInfo.introduction" :key="index">
        <h3>{{ item.ti }}</h3>
        <p>{{ item.txt }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  descInfo: Object,
})
</script>
<style lang="less" scoped>
h3 {
  margin: 10px 20px;
}

p {
  margin: 20px;
  white-space: pre-line;
  color: var(--color-text);
  line-height: 1.7;
}
</style>
