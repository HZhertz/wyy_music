<template>
  <div class="banner">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item class="skeleton-img" variant="image" v-for="item in slidesPerView" />
      </template>
      <template #default>
        <Swiper
          :slides-per-view="slidesPerView"
          :space-between="30"
          :modules="modules"
          :autoplay="{ delay: 3000 }"
          :pagination="{ clickable: true }"
          v-if="lists"
          class="banner_wrap"
        >
          <SwiperSlide v-for="item of lists" :key="item.imageUrl">
            <el-image
              :src="item.imageUrl"
              :alt="item.typeTitle"
              fit="cover"
              class="banner_img"
              @click="pathHandler(item)"
            >
              <template #placeholder>
                <div class="image-slot">
                  <i class="iconfont icon-placeholder"></i>
                </div>
              </template>
            </el-image>
          </SwiperSlide>
        </Swiper>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css/pagination'

const { proxy } = getCurrentInstance()
const router = useRouter()
const modules = [Autoplay, Pagination]

let lists = ref([])
let loading = ref(true)

const getBanner = async () => {
  try {
    const { data: res } = await proxy.$http.getBanner()

    if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
    }

    lists.value = res.banners
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

const pathHandler = (params) => {
  switch (params.targetType) {
    case 1: // 单曲
      router.push({ path: '/song', query: { id: params.targetId } })
      break
    case 10: // 专辑
      router.push({ path: '/album', query: { id: params.targetId } })
      break
    case 1000: // 歌单
      router.push({ path: '/playlist', query: { id: params.targetId } })
      break
    case 1004: // MV
      router.push({ path: '/mv/detail', query: { id: params.targetId } })
      break
    case 3000: // 外链
      window.open(params.url, '_blank')
      break
  }
}

const viewportWidth = ref(window.innerWidth)
const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth
}
onMounted(() => {
  getBanner()
  window.addEventListener('resize', updateViewportWidth)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth)
})
const slidesPerView = computed(() => {
  if (viewportWidth.value > 1400) {
    return 4
  }
  if (viewportWidth.value > 1100 && viewportWidth.value < 1400) {
    return 3
  }
  if (viewportWidth.value < 1100) {
    return 2
  }
})
</script>

<style lang="less" scoped>
.banner {
  padding-bottom: 30px;
}
.banner_wrap {
  padding: 40px 0;
  min-width: 640px;

  .banner_img {
    cursor: pointer;
  }
  .el-image {
    height: 100%;
  }
}

.el-skeleton {
  display: flex;
  justify-content: space-between;
  padding: 40px 0;

  .skeleton-img {
    flex: 1;
    margin-right: 30px;

    &:last-child {
      margin: 0;
    }
  }
}
.swiper {
  .swiper-slide {
    height: 105px;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    overflow: hidden;
  }
  :deep(.swiper-pagination-bullet-active) {
    width: 15px;
    border-radius: 4px;
    background: var(--color-text-height);
  }
}
</style>
