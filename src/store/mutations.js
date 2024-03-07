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
  }
}
