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
// 获取用户信息 , 歌单，收藏，mv, dj 数量
const getUserSubcount = () => {
  return api.get('/user/subcount', {})
}
// 获取用户歌单
const getUserPlaylist = ({ uid = '', timestamp = new Date().valueOf() }) => {
  return api.get(`/user/playlist?uid=${uid}&timestamp=${timestamp}`, {})
}

/* ********* 搜索 ********* */
// 热门搜索
const serachHot = () => {
  return api.get('/search/hot', {})
}
// 搜索联想
const serachSuggest = ({ keywords = '' }) => {
  return api.get(`/search/suggest?keywords=${keywords}`, {})
}
// 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
const cloudsearch = ({ keywords = '', limit = 30, offset = 0, type = '1' }) => {
  return api.get(`/cloudsearch?keywords=${keywords}&limit=${limit}&offset=${offset}&type=${type}`, {})
}

/* ********* 首页 ********* */
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

/* ********* 歌曲 ********* */
// 歌曲详情 多个id , 隔开
const songDetail = ({ ids = '', timestamp = 0 }) => {
  return api.post(`/song/detail?timestamp=${timestamp}`, { ids: ids })
}
// 对歌单添加或删除歌曲
// 调用此接口 , 可以添加歌曲到歌单或者从歌单删除某首歌曲 ( 需要登录 )
// op: 从歌单增加单曲为 add, 删除为 del
// pid: 歌单 id
// tracks: 歌曲 id,可多个,用逗号隔开
const playlistTracks = ({ op, pid, tracks, timestamp }) => {
  return api.get(`/playlist/tracks?op=${op}&pid=${pid}&tracks=${tracks}&timestamp=${timestamp}`)
}
// 获取相似音乐
const simiSong = ({ id = '' }) => {
  return api.get(`/simi/song?id=${id}`, {})
}
// 歌词
const lyrics = ({ id = '' }) => {
  return api.get(`/lyric?id=${id}`, {})
}

/* ********* 评论 ********* */
/*
 * 发送/删除评论
 * t: 0删除 1发送 2回复
 * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
 * id: 对应资源id
 * content: 发送的内容/对应内容的id
 * commentId: 回复的评论id
 */
const comment = ({ t = 1, type = 0, id = '', content = '', commentId = '' }) => {
  return api.get(`/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}`, {})
}
/*
 * 给评论点赞
 * id: 对应资源id
 * cid: 评论id
 * t: 是否点赞 1: 是  0: 取消
 * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
 */
const commentLike = ({ id = '', cid = '', t = 1, type = 0 }) => {
  return api.get(`/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}`, {})
}

// 歌曲评论
const commentSong = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => {
  return api.get(
    `/comment/music?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`,
    {}
  )
}
// 获取mv评论
const commentMv = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => {
  return api.get(
    `/comment/mv?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`,
    {}
  )
}
// 获取video评论
const commentVideo = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => {
  return api.get(
    `/comment/video?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`,
    {}
  )
}
// 专辑评论
const albumComment = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => {
  return api.get(
    `/comment/album?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`,
    {}
  )
}

/* ********* 专辑 ********* */
// 获取专辑内容
const album = ({ id = '' }) => {
  return api.get(`/album?id=${id}`, {})
}
// 获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
const albumDynamic = ({ id = '' }) => {
  return api.get(`/album/detail/dynamic?id=${id}`, {})
}
// 收藏/取消收藏专辑
const albumSub = ({ id = '', t = 1 }) => {
  return api.get(`/album/sub?id=${id}&t=${t}`, {})
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
// 包含这首歌的歌单
const simiPlayList = ({ id = '' }) => {
  return api.get(`/simi/playlist?id=${id}`, {})
}
// 歌单详情
const playlistdetail = ({ id = '', s = 8 }) => {
  return api.get(`/playlist/detail?id=${id}&s=${s}`, {})
}
// 获取歌单所有歌曲
const playlistTrackAll = ({ id, limit, offset, timestamp }) => {
  return api.get(`/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}&timestamp=${timestamp}`, {})
}
// 歌单收藏用户
const playlistSubscribers = ({ id = '', limit = 20, offset = 0 }) => {
  return api.get(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`, {})
}
// 相关歌单推荐
const playlistRelated = ({ id = '' }) => {
  return api.get(`/related/playlist?id=${id}`, {})
}
// 歌单评论
const playlistComment = ({ id = '', limit = 20, offset = 0, before = 0 }) => {
  return api.get(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}&before=${before}`, {})
}
// 收藏、取消歌单 1：收藏 2取消
const subPlayList = ({ t = 1, id = '' }) => {
  return api.get(`/playlist/subscribe?t=${t}&id=${id}`, {})
}

/* ********* 专辑 ********* */
// 新碟上架
const topAlbum = ({ limit = 20, offset = 0, area = 'all', type = 'new', year = '', month = '' }) => {
  return api.get(
    `/top/album?limit=${limit}&offset=${offset}&area=${area}&type=${type}&year=${year}&month=${month}`,
    {}
  )
}

/* ********* MV ********* */
// 获取 mv
const mv = ({ area = '', type = '', order = '', limit = 50, offset = 0 }) => {
  return api.get(`/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`, {})
}
// 获取 mv详情
const mvDetail = ({ id = '' }) => {
  return api.get(`/mv/detail?mvid=${id}`, {})
}
// 获取 地址
const mvUrl = ({ id = '', r = 1080 }) => {
  return api.get(`/mv/url?id=${id}&r=${r}`, {})
}
// 相似mv
const simiMv = ({ id = '' }) => {
  return api.get(`/simi/mv?mvid=${id}`, {})
}
/* ********* 歌手 ********* */
// 获取歌手列表
/*
 * type: -1:全部; 1:男歌手; 2:女歌手; 3:乐队
 * area: -1:全部; 7华语; 96欧美; 8:日本; 16韩国; 0:其他
 * initial: 按首字母索引查找参数, 热门传-1, #传0
 * limit: 30
 * offset: 0
 */
const artistList = ({ type = -1, area = -1, initial = '', limit = 50, offset = 0 }) => {
  return api.get(
    `/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}`,
    {}
  )
}
// 获取歌手详情
// 调用此接口 , 传入歌手 id, 可获得获取歌手详情
const artistDetail = ({ id = '' }) => {
  return api.get(`/artist/detail?id=${id}`, {})
}
// 歌手粉丝数量
// 调用此接口 , 传入歌手 id, 可获取歌手粉丝数量
const artistFollowCount = ({ id = '' }) => {
  return api.get(`/artist/follow/count?id=${id}`, {})
}
// 收藏/取消收藏歌手
// 调用此接口,可收藏歌手
// t:操作,1 为收藏,其他为取消收藏
const artistSub = ({ id = '', t }) => {
  return api.get(`/artist/sub?id=${id}&t=${t}`, {})
}
// 获取歌手单曲
// 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲
const artist = ({ id = '' }) => {
  return api.get(`/artists?id=${id}`, {})
}
// 歌手热门 50 首歌曲
// 调用此接口,可获取歌手热门 50 首歌曲
const artistHotSong = ({ id = '' }) => {
  return api.get(`/artist/top/song?id=${id}`, {})
}
// 获取歌手全部歌曲
// order - hot ,time 按照热门或者时间排序
// limit - 取出歌单数量 , 默认为 50
const artistAllSong = ({ id = '', order = 'time', limit = 50, offset = 0 }) => {
  return api.get(`/artist/songs?id=${id}&order=${order}&limit=${limit}&offset=${offset}`, {})
}
// 获取歌手专辑
// 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
const artistAlbum = ({ id = '', limit = 12, offset = 0 }) => {
  return api.get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`, {})
}
// 获取歌手 mv
// 调用此接口 , 传入歌手 id, 可获得歌手 mv 信息
const artistMv = ({ id = '', limit = 12, offset = 0 }) => {
  return api.get(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`, {})
}
// 获取歌手描述
// 调用此接口 , 传入歌手 id, 可获得歌手描述
const artistDesc = ({ id = '' }) => {
  return api.get(`/artist/desc?id=${id}`, {})
}
// 获取相似歌手
// 调用此接口 , 传入歌手 id, 可获得相似歌手
const simiArtist = ({ id = '' }) => {
  return api.get(`/simi/artist?id=${id}`, {})
}

export {
  login,
  logout,
  getUserInfo,
  getUserSubcount,
  getUserPlaylist,
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
  catlist,
  artistList,
  cloudsearch,
  songDetail,
  playlistTracks,
  simiSong,
  simiPlayList,
  lyrics,
  commentSong,
  commentMv,
  commentVideo,
  albumComment,
  comment,
  commentLike,
  album,
  albumDynamic,
  albumSub,
  mvDetail,
  mvUrl,
  simiMv,
  artistDetail,
  artistFollowCount,
  artistHotSong,
  artist,
  artistAllSong,
  artistAlbum,
  artistMv,
  artistDesc,
  simiArtist,
  playlistdetail,
  playlistSubscribers,
  playlistRelated,
  playlistComment,
  subPlayList,
  playlistTrackAll,
}
