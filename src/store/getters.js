export default {
  isLogin(state) {
    return state.isLogin || JSON.parse(window.localStorage.getItem('isLogin'))
  },
  loginDialogVisible(state) {
    return state.loginDialogVisible
  },
  userInfo(state) {
    return state.userInfo || JSON.parse(window.localStorage.getItem('userInfo') || '{}')
  }
}
