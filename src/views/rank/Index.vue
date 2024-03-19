<template>
  <div class="rank">
    <div class="rank-container">
				<div class="rank-main">
					<div class="cover">
						<div class="cover-img">
							<el-image :src="rankInfo.coverImgUrl">
								<div slot="placeholder" class="image-slot">
									<i class="iconfont icon-placeholder"></i>
								</div>
							</el-image>
						</div>
						<div class="cover-info">
							<div class="cover-header">
								<div class="cover-title">
									{{ rankInfo.name }}
									<span>({{ $utils.formartDate(rankInfo.updateTime, 'MM月dd日') }} 更新)</span>
								</div>
							</div>
							<div class="cover-author-tags">
								<div class="cover-author" v-if="rankInfo.creator">
									<el-image :src="rankInfo.creator.avatarUrl" class="cover-avatar">
										<div slot="placeholder" class="image-slot">
											<i class="iconfont icon-placeholder"></i>
										</div>
									</el-image>
									<div class="cover-name">{{ rankInfo.creator.nickname }}</div>
									<div class="cover-date">
										{{ $utils.formartDate(rankInfo.createTime, 'yyyy-MM-dd') }}
									</div>
								</div>
							</div>
							<div class="cover-digital">
								<span class="cover-playCount"
									><i class="iconfont icon-playnum"></i> {{ $utils.formartNum(rankInfo.playCount) }}次</span
								>
								<span class="cover-collect"
									><i class="iconfont icon-collect"></i> {{ $utils.formartNum(rankInfo.subscribedCount) }}</span
								>
								<span class="cover-comment"
									><i class="iconfont icon-comment"></i> {{ $utils.formartNum(rankInfo.commentCount) }}</span
								>
							</div>
							<div class="cover-desc">
								<h5>歌单简介</h5>
								<p v-html="rankInfo.description"></p>
							</div>
						</div>
					</div>
					<div class="song-main">
						<div class="song-header">
							<h4>
								歌曲列表 <em>{{ total + '首歌' }}</em>
							</h4>
							<span class="play-all" @click="playAllSongs"
								><i class="iconfont icon-audio-play"></i> 播放全部</span
							>
							<span :class="['collect', rankInfo.subscribed ? 'active' : '']" @click="subPlayList(rankInfo)"
								><i :class="['iconfont', 'icon-collect' + (rankInfo.subscribed ? '-active' : '')]"></i>
								{{ rankInfo.subscribed ? '已收藏' : '收藏' }}</span
							>
						</div>
						<template v-if="isLoading">
							<Loading />
						</template>
						<template v-else>
							<SongList :songList="songList" :stripe="true" />
						</template>
					</div>
				</div>
      <div class="rank-aside">
        <div class="aside-menu">
          <span :class="type === 'Top' ? 'active' : ''" @click="selectType('Top')"><em>TOP榜</em></span>
          <span :class="type === 'Feature' ? 'active' : ''" @click="selectType('Feature')"
            ><em>特色榜</em></span
          >
          <span :class="type === 'Other' ? 'active' : ''" @click="selectType('Other')"><em>场景榜</em></span>
        </div>
        <div class="type-main">
          <div
            class="type-item"
            :class="rId == item.id ? 'active' : ''"
            v-for="(item, index) in list"
            :key="index"
            @click="selectItem(item)"
          >
            <div class="item-info">
              <div class="item-title">
                {{ item.name }}
              </div>
              <div class="item-time">
                {{ item.updateFrequency }}
              </div>
            </div>
            <el-image class="item-img" :src="item.coverImgUrl">
              <div slot="placeholder" class="image-slot">
                <i class="iconfont icon-placeholder"></i>
              </div>
            </el-image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, onMounted, toRefs, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SongList from '@/components/SongList.vue'
import Loading from '@/components/Loading.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()

const info = reactive({
  list: [],
  type: 'Top',
  listTop: [],
  listFeature: [],
  listOther: [],
  rId: 0,
  rankInfo: {},
  songList: [],
  total: 0,
  isLoading: true,
})
const { list, type, listTop, listFeature, listOther, rId, rankInfo, songList, total, isLoading } =
  toRefs(info)

onMounted(() => {
  type.value = route.query.type || type.value
  rId.value = route.query.rId
  getTopListDetail()
})
const getTopListDetail = async () => {
  const { data: res } = await proxy.$http.topListDetail()

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  // 云音乐TOP榜
  listTop.value = res.list.filter((item) => {
    return item.ToplistType
  })
  // 云音乐特色榜
  listFeature.value = res.list.filter((item) => {
    return !item.ToplistType && item.name.indexOf('云音乐') >= 0
  })
  // 其他场景榜
  listOther.value = res.list.filter((item) => {
    return !item.ToplistType && item.name.indexOf('云音乐') < 0
  })

  list.value = type.value ? info['list' + type.value] : listTop.value
  rId.value = rId.value ? rId.value : listTop.value[0].id
}

watchEffect(() => {
  if (rId.value) {
    getListDetail()
  }
})
const getListDetail = async () => {
  isLoading.value = true
  const { data: res } = await proxy.$http.listDetail({ id: rId.value, s: -1 })

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }

  rankInfo.value = res.playlist
  songList.value = proxy.$utils.formatSongs(res.playlist.tracks, res.privileges)
  total.value = songList.value.length
  isLoading.value = false
}

const selectType = (type_) => {
  type.value = type_
  list.value = info['list' + type.value]
  rId.value = info['list' + type_][0].id
  router.push({ path: 'rank', query: { type: type.value, rId: rId.value } })
}

const selectItem = (item) => {
  rId.value = item.id
  router.push({ path: 'rank', query: { type: type.value, rId: rId.value } })
}

const playAllSongs = () => {
  store.dispatch('playAll', {
    list: songList.value,
  })
  store.commit('SET_PLAYLISTTIPS', true)
}
</script>
<style lang="less" scoped>
.rank-container {
  display: flex;
  padding: 40px 0 0 0;
}
.rank-main {
  flex: 1;
  padding-bottom: 45px;
}

.rank-aside {
  width: 450px;
  padding-bottom: 25px;
  flex-shrink: 0;
  padding-left: 20px;
}

.cover {
  display: flex;
}
.cover-img {
  display: flex;
  align-items: center;
  width: 250px;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  flex-shrink: 0;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: '';
    transform: scale(0.95) translateX(5%);
    background: #f0f0f0;
  }
}

.cover-info {
  flex: 1;
  padding: 20px;
  margin-left: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

  .cover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cover-title {
    flex: 1;
    font-size: 24px;
    font-weight: bold;
    height: 34px;
    line-height: 34px;

    span {
      display: inline-block;
      padding-left: 10px;
      font-weight: normal;
      line-height: 22px;
      font-size: 14px;
      color: var(--color-text);
    }
  }

  .cover-collect-author {
    width: 200px;
    text-align: right;
  }

  .collect-author {
    position: relative;
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    overflow: hidden;
    margin: 3px 0 0 -15px;
    border: 1px solid #fff;
    vertical-align: top;

    &:hover {
      z-index: 1;
      border: 1px solid var(--color-text-height);
    }
  }
}
.cover-author-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cover-author {
  padding: 15px 0 10px;

  .cover-avatar {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    vertical-align: top;
  }

  .cover-name,
  .cover-date {
    display: inline-block;
    padding: 0 10px;
    line-height: 32px;
  }

  .cover-date {
    color: var(--color-text);
  }
}
.cover-playCount,
.cover-collect,
.cover-comment {
  display: inline-block;
  padding: 0 20px 5px 0;
  line-height: 16px;
  font-size: 14px;
  color: var(--color-text);

  i {
    vertical-align: top;
  }
}
.cover-desc {
  position: relative;

  h5 {
    padding: 25px 0 5px;
    line-height: 20px;
    font-size: 14px;
    color: var(--color-text-main);
  }

  p {
    line-height: 22px;
    font-size: 14px;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
}
.song-main {
  position: relative;
  padding: 0 20px;
  margin-top: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);
}
.song-header {
  display: flex;
  padding: 30px 0 10px;

  h4 {
    flex: 1;
    font-size: 20px;
    line-height: 40px;

    em {
      display: inline-block;
      padding-left: 10px;
      font-size: 12px;
      line-height: 14px;
      font-style: normal;
      font-weight: normal;
      color: #666;
      vertical-align: baseline;
    }
  }

  span {
    display: flex;
    line-height: 16px;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    padding: 7px 20px;
    cursor: pointer;
    margin: 5px 0 5px 15px;
    transition: all 0.4s;
    background: #f0f0f0;
    color: #333;

    i {
      margin-right: 3px;
    }
  }

  .play-all {
    color: #fff;
    background: var(--color-text-height);

    i {
      color: #fff;
    }
  }

  .collect.active,
  .collect.active i {
    color: var(--color-text-height);
  }
}

.aside-menu {
  display: flex;
  margin: 0 -10px 20px;

  span {
    flex: 1;
    position: relative;
    display: inline-block;
    height: 14px;
    line-height: 14px;
    padding: 20px;
    margin: 0 10px;
    text-align: center;
    background: #fff;
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    color: var(--color-text-main);
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    transition: color 0.2s ease-in;

    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      display: block;
      content: '';
      width: 100%;
      height: 0;
      background: var(--color-text-height);
      transition: height 0.2s ease-in;
    }

    &.active {
      position: relative;
      color: #fff;
      transition: color 0.2s ease-in;

      &::before {
        height: 100%;
        transition: height 0.2s ease-in;
      }
    }

    em {
      position: relative;
      z-index: 2;
      font-style: normal;
    }
  }
}
.type-main {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 -10px;
}
.type-item {
  display: flex;
  justify-content: space-between;
  width: calc(50% - 60px);
  padding: 10px 20px;
  margin: 0 10px 20px;
  background: #fff;
  border-radius: 12px;
  opacity: 0.8;
  cursor: pointer;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

  .item-info {
    flex: 1;
    width: calc(100% - 50px);
  }

  .item-img {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    margin-left: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
  }

  .item-title {
    width: 100%;
    font-weight: bold;
    line-height: 30px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .item-time {
    font-size: 12px;
    line-height: 12px;
    color: var(--color-text);
  }

  &.active {
    opacity: 1;
    background: -moz-linear-gradient(-45deg, #ffffff 20%, #ffb08e 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg, #ffffff 20%, #ffb08e 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(
      135deg,
      #ffffff 20%,
      #ffb08e 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  }
}

@media screen and (max-width: 1500px) {
  .rank-aside {
    width: 350px;
  }
}
</style>
