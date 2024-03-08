import { getCurrentInstance, reactive, onMounted, toRefs } from 'vue'
import { ALBUM_AREA } from '@/assets/js/common.js'

export default () => {
  const { proxy } = getCurrentInstance()

  // -------------- 新碟上架
  // 热门卡碟
  const album_info = reactive({
    album_area: ALBUM_AREA,
    album_list: [],
    album_index: 0,
    album_params: { limit: 12 },
    album_count: 12,
    album_loading: true
  })

  // 新碟上架
  const getAlbumList = async (params) => {
    const { data: res } = await proxy.$http.topAlbum(params)

    if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
    }
    album_info.album_list = res.monthData.slice(0, album_info.album_count)
    // album_info.album_list = proxy.$utils.randomSelection(res.monthData, album_info.album_count)
    album_info.album_loading = false
  }

  // 切换卡碟类别
  const chooseAlbumType = (index) => {
    album_info.album_index = index
    album_info.album_params.area = index !== 0 ? album_info.album_area[index].code : ''
    album_info.album_loading = true
    getAlbumList(album_info.album_params)
  }

  onMounted(() => {
    getAlbumList(album_info.album_params)
  })

  return {
    ...toRefs(album_info),
    chooseAlbumType
  }
}
