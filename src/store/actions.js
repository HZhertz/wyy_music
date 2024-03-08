import * as types from './mutation-types'
import utils from '@/utils/util'

// 合并歌曲到播放列表查重
const concatPlayList = (list, playList = []) => {
  // filter过滤无版权及vip歌曲
  return utils.concatPlayList(
    list.filter((item) => {
      return !item.license && !item.vip
    }),
    playList
  )
}

export default {
  loginSuc(context, val) {
    context.commit('setLoginDialog', val)
  },
  // 添加歌曲到当前播放列表
  addList({ commit, state }, { list }) {
    const playList = concatPlayList(list, state.playList)
    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_PLAYLISTTIPS, true)
  }
}
