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

// 首页轮播图
const getBanner = () => {
  return api.get('/banner', {})
}
// 热门电台
const getHotDj = ({ limit = 30, offset = 0 }) => {
  return api.get(`/dj/hot?limit=${limit}&offset=${offset}`, {})
}
// 热门歌手
const topArtists = ({ limit = 30, offset = 0 }) => {
  return api.get(`/top/artists?limit=${limit}&offset=${offset}`, {})
}

/* ********* 排行榜 ********* */
// 排行榜
const toplist = () => {
  return api.get('/toplist', {})
}
// 排行榜歌单列表
const topRankList = ({ id = '', s = 8 }) => {
  return api.get(`/playlist/detail?id=${id}&s=${s}`, {})
}
// 所有榜单内容摘要
const topListDetail = () => {
  return api.get('/toplist/detail', {})
}
// 歌单详情
const listDetail = ({ id = '', s = 8 }) => {
  return api.get(`/playlist/detail?id=${id}&s=${s}`, {})
}

/* ********* 歌单 ********* */
// 热门歌单分类
const hotList = () => {
  return api.get('/playlist/hot', {})
}
// 歌单列表
const playList = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => {
  return api.get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`, {})
}
// 歌单分类
const catlist = () => {
  return api.get('/playlist/catlist', {})
}

/* ********* 专辑 ********* */
// 新碟上架
const topAlbum = ({
  limit = 20,
  offset = 0,
  area = 'all',
  type = 'new',
  year = '',
  month = ''
}) => {
  return api.get(
    `/top/album?limit=${limit}&offset=${offset}&area=${area}&type=${type}&year=${year}&month=${month}`,
    {}
  )
}

/* ********* MV ********* */
// 获取 mv
const mv = ({ area = '', type = '', order = '', limit = 50, offset = 0 }) => {
  return api.get(
    `/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`,
    {}
  )
}

export {
  login,
  logout,
  getUserInfo,
  serachHot,
  serachSuggest,
  getBanner,
  hotList,
  playList,
  topAlbum,
  toplist,
  topRankList,
  mv,
  getHotDj,
  topArtists,
  topListDetail,
  listDetail,
  catlist
}
