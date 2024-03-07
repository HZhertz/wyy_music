export default {
  loginSuc(context, val) {
    context.commit('setLoginDialog', val)
  }
}
