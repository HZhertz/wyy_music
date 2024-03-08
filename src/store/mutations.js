import * as types from './mutation-types'

export default {
  [types.SET_LOGIN](state, val = false) {
    state.isLogin = val
  },
  [types.SET_USERINFO](state, val) {
    state.userInfo = val
  },
  [types.SET_LOGINDIALOG](state, val) {
    state.loginDialogVisible = val
  },
  [types.SET_PLAYLIST](state, val = null) {
    state.playList = val
    window.localStorage.setItem('playList', JSON.stringify(val))
  },
  [types.SET_PLAYLISTTIPS](state, val = false) {
    state.isShowPlayListTips = val
  }
}
