class Song {
  constructor({ id, name, mvId, singer, album, alia, duration, url, vip, license, publishTime }) {
    this.id = id
    this.name = name
    this.mvId = mvId
    this.singer = singer
    this.album = album
    this.alia = alia
    this.duration = duration
    this.url = url
    this.vip = vip
    this.license = license
    this.publishTime = publishTime
  }
}

// 数字过万的处理
function formartNum(val) {
  let num = 0
  if (val > 9999) {
    num = Math.round((val / 10000) * 10) / 10 + '万'
  } else {
    num = val
  }

  return num
}
// 提取歌曲信息
function formatSongInfo(params) {
  return new Song({
    id: String(params.id),
    name: params.name,
    mvId: params.mv,
    singer: params.ar,
    album: params.al,
    alia: params.alia,
    vip: params.fee === 1,
    license: params.license,
    duration: formatSongTime(params.dt),
    url: `https://music.163.com/song/media/outer/url?id=${params.id}.mp3`,
    publishTime: formatMsgTime(params.publishTime),
  })
}
// 处理歌曲
function formatSongs(list, privileges) {
  const ret = []
  list.map((item, index) => {
    if (item.id) {
      // 是否有版权播放
      item.license = !privileges[index].cp
      ret.push(formatSongInfo(item))
    }
  })
  return ret
}
// 歌曲转毫秒格式化处理 03:30 => (3*60+30) * 1000
function formatSongSecond(duration) {
  let arr = duration.split(':'),
    second = 0

  for (let i = 0; i < arr.length; i++) {
    second += arr[i] * 60 * (arr.length - 1 - i)
  }

  second += arr[arr.length - 1] * 1

  return second
}
// 歌曲毫秒格式化处理 03:30
function formatSongTime(duration = 0) {
  duration = duration >= 0 ? duration / 1000 : 0
  const m = (Math.floor(duration / 60) + '').padStart(2, '0')
  const s = (Math.floor(duration % 60) + '').padStart(2, '0')
  return `${m}:${s}`
}
// 评论时间格式化处理
function formatMsgTime(duration) {
  let result = ''
  const NOW = new Date()
  const PAST = new Date(duration)

  // 判断是当天的时间 显示格式 10：30
  if (NOW.toDateString() === PAST.toDateString()) {
    result = formartDate(duration, 'HH:mm')
    // 时间为当年 显示月日 时间戳
  } else if (PAST.getFullYear() === NOW.getFullYear()) {
    result = formartDate(duration, 'MM月dd日 HH:mm')
  } else {
    result = formartDate(duration, 'yyyy年MM月dd日')
  }

  return result
}
// 添加歌曲到播放列表，过滤重复的歌曲
function concatPlayList(newList = [], oldList = []) {
  const arr = [...oldList, ...newList]
  const map = new Map()

  for (const item of arr) {
    if (!map.has(item.id)) {
      map.set(item.id, item)
    }
  }

  return [...map.values()]
}
// 时间毫秒格式化处理 2020-10-30 09:30:00
function formartDate(originVal, fmt) {
  const dt = new Date(originVal)
  const opt = {
    yyyy: dt.getFullYear(),
    MM: (dt.getMonth() + 1 + '').padStart(2, '0'),
    dd: (dt.getDate() + '').padStart(2, '0'),
    HH: (dt.getHours() + '').padStart(2, '0'),
    mm: (dt.getMinutes() + '').padStart(2, '0'),
    ss: (dt.getSeconds() + '').padStart(2, '0'),
  }

  for (const k in opt) {
    const ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], opt[k])
    }
  }

  return fmt
}

export default {
  formartNum,
  formatSongInfo,
  formatSongs,
  formatSongSecond,
  formatSongTime,
  formatMsgTime,
  concatPlayList,
  formartDate,
}
