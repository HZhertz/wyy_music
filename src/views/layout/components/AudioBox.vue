<template>
  <audio
    v-if="curSongInfo"
    ref="myAudio"
    preload="auto"
    @canplay="canplaySong"
    @playing="playSong"
    @ended="endedSong"
    @error="errorSong"
    @timeupdate="updateSongTime"
    :src="curSongInfo.url"
  ></audio>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['setCurrentTime'])
const info = reactive({
  initAudioReady: false, // 初始化音频准备
  playMode: 0, // 播放模式  0循环播放、1单曲循环、2随机播放
})

const myAudio = ref(null)

const playIndex = computed(() => store.getters.playIndex)
const playList = computed(() => store.getters.playList)
const isPlayed = computed(() => store.getters.isPlayed)
const curSongInfo = computed(() => playList.value[playIndex.value])

// 点击拖拽进度条，设置当前时间
const setAudioProgress = (t) => {
  const $myAudio = myAudio.value
  $myAudio.currentTime = t
}
// 音乐 播放/暂停/上一首/下一首
const playAudioType = (type) => {
  if (type === 'play') {
    store.commit('SET_PLAYSTATUS', !isPlayed.value)
    // store.commit('SET_PLAYINDEX', playIndex.value)
  } else {
    changeSong(type)
  }
}
// 音量禁音及取消操作
const setVolumeHandler = (Volume) => {
  const $myAudio = myAudio.value
  $myAudio.muted = Volume
}
const setvolumeProgress = (val) => {
  const $myAudio = myAudio.value
  $myAudio.volume = val
  $myAudio.muted = val ? 0 : 1
}
// 播放模式：随机、循环、单曲
const playAudioMode = (type) => {
  info.playMode = type
}

// 解决刷新页面时候，音频准备就绪
const canplaySong = (e) => {
  info.initAudioReady = true
}

// 音频播放时候 初始化状态，获取音频总时长
const playSong = (e) => {
  info.initAudioReady = true
  store.commit('SET_PLAYSTATUS', true)
}

// 音频播放结束 自动播放下一首
const endedSong = (e) => {
  if (info.playMode === 1) {
    loopSong()
  } else {
    changeSong('next')
  }
}
// 单曲循环歌曲
const loopSong = () => {
  const $myAudio = myAudio.value

  $myAudio.currentTime = 0
  $myAudio.play()
  store.commit('SET_PLAYSTATUS', true)
}

// 手动切换歌曲
const changeSong = (type) => {
  // type: prev/next  上一首/下一首
  if (playList.value.length !== 1) {
    let index = playIndex.value
    if (info.playMode === 2) {
      // 随机模式
      index = Math.floor(Math.random() * playList.value.length - 1) + 1
    } else {
      if (type === 'prev') {
        index = index === 0 ? playList.value.length - 1 : --index
      } else {
        index = index >= playList.value.length - 1 ? 0 : ++index
      }
    }
    // 设置为 false 是为了准备切换到新的歌曲。确保在切换歌曲时，音频元素和播放状态都能正确地反映出新的歌曲的状态
    info.initAudioReady = false
    // store.commit('SET_PLAYSTATUS', false)
    store.commit('SET_PLAYSTATUS', true)
    store.commit('SET_PLAYINDEX', index)
  } else {
    // 若播放列表只有一首歌则单曲循环
    loopSong()
  }
}

// 监听音频时间， 实时更新当前播放时间
const updateSongTime = (e) => {
  if (!info.initAudioReady) {
    return
  }
  emit('setCurrentTime', e.target.currentTime)
}
const errorSong = (e) => {
  console.error('音频播放出错:', e)
}

watch(
  curSongInfo,
  (newSong, oldSong) => {
    if (!newSong || (oldSong && newSong.id === oldSong.id)) {
      return
    }
    // 当前播放歌曲变化的时候  重置状态及当前播放的时长
    info.initAudioReady = false
    info.currentTime = 0
    emit('setCurrentTime', 0)

    nextTick(() => {
      const $myAudio = myAudio.value

      if ($myAudio) {
        $myAudio.play()
      }
    })
  },
  { deep: true }
)

watch(isPlayed, (newIsPlayed) => {
  // 等待音频加载成功完成后播放
  if (!info.initAudioReady) {
    return
  }

  nextTick(() => {
    const $myAudio = myAudio.value

    if ($myAudio) {
      newIsPlayed ? $myAudio.play() : $myAudio.pause()
    }
  })
})
defineExpose({
  setAudioProgress,
  playAudioType,
  setVolumeHandler,
  setvolumeProgress,
  playAudioMode,
})
</script>
<style scoped></style>
