import { getCurrentInstance, reactive, onMounted, toRefs } from 'vue'
import { MV_AREA } from '@/assets/js/common.js'

export default () => {
  const { proxy } = getCurrentInstance()

  // MV
  const mv_info = reactive({
    mv_area: MV_AREA,
    mv_list: [],
    mv_index: 0,
    mv_params: { limit: 12 },
    mv_count: 12,
    mv_loading: true,
  })

  // 最新MV
  const getMv = async (params) => {
    const { data: res } = await proxy.$http.mv(params)

    if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
    }

    mv_info.mv_list = res.data
    mv_info.mv_loading = false
  }

  // 切换MV类别
  const chooseMvType = (index) => {
    mv_info.mv_index = index
    mv_info.mv_params.area = index !== 0 ? mv_info.mv_area[index] : ''
    mv_info.mv_loading = true
    getMv(mv_info.mv_params)
  }

  onMounted(() => {
    getMv(mv_info.mv_params)
  })

  return {
    ...toRefs(mv_info),
    chooseMvType,
  }
}
