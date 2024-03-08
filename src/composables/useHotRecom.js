import { getCurrentInstance, reactive, toRefs, onMounted } from 'vue'

export default () => {
  const { proxy } = getCurrentInstance()

  // -------------- 推荐歌单
  // 热门推荐歌单
  const playlist_info = reactive({
    playlist_tags: [],
    playlist_list: [],
    playlist_index: 0,
    playlist_params: { limit: 6, offset: 0 },
    playlist_count: 6,
    playlist_loading: true
  })

  // 获取热门推荐歌单标签
  const getHotTags = async () => {
    const { data: res } = await proxy.$http.hotList()
    if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
    }
    res.tags.unshift({ name: '为您推荐' })
    // playlist_info.playlist_tags = res.tags.slice(0, 6)
    playlist_info.playlist_tags = res.tags
  }
  // 切换歌单类别
  const choosePlayListType = (index) => {
    playlist_info.playlist_index = index
    // cat 为接口参数
    playlist_info.playlist_params.cat = index !== 0 ? playlist_info.playlist_tags[index].name : ''
    playlist_info.playlist_loading = true
    getPlayList(playlist_info.playlist_params)
  }

  // 分类歌单列表
  const getPlayList = async (params) => {
    const { data: res } = await proxy.$http.playList(params)

    if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
    }

    playlist_info.playlist_list = res.playlists
    playlist_info.playlist_loading = false
  }

  onMounted(() => {
    getHotTags()
    getPlayList(playlist_info.playlist_params)
  })

  return {
    ...toRefs(playlist_info),
    getHotTags,
    choosePlayListType
  }
}
