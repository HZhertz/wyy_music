export default {
  isLogin(state) {
    return state.isLogin || JSON.parse(window.localStorage.getItem('isLogin'))
  },
  loginDialogVisible(state) {
    return state.loginDialogVisible
  },
  userInfo(state) {
    return state.userInfo || JSON.parse(window.localStorage.getItem('userInfo') || '{}')
  },
  playList(state) {
    return state.playList.length ? state.playList : JSON.parse(window.localStorage.getItem('playList')) || []
  },
  isPlayed(state) {
    return state.isPlayed
  },
  playIndex(state) {
    return state.playIndex || JSON.parse(window.localStorage.getItem('playIndex')) || 0
  },
  isShowPlayListTips(state) {
    return state.isShowPlayListTips
  },
  currentTime(state) {
    return state.currentTime || JSON.parse(window.localStorage.getItem('currentTime')) || 0
  },
  volume(state) {
    return state.volume || JSON.parse(window.localStorage.getItem('volume')) || 0.5
  },
}
