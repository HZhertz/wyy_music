import api from './instance'

// 登录
const login = ({ phone = '', pwd = '', realIP = '116.25.146.177' }) => {
  return api.post(`/login/cellphone`, { phone, password: pwd, realIP })
}
// 退出登录
const logout = () => {
  return api.get('/logout', {})
}
// 获取用户详情
const getUserInfo = ({ uid = '' }) => {
  return api.get(`/user/detail?uid=${uid}`, {})
}

// 热门搜索
const serachHot = () => {
  return api.get('/search/hot', {})
}
// 搜索联想
const serachSuggest = ({ keywords = '' }) => {
  return api.get(`/search/suggest?keywords=${keywords}`, {})
}

export { login, logout, getUserInfo, serachHot, serachSuggest }
