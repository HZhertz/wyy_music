<template>
  <div class="index">
    <Banners />
    <div class="hot-list">
      <div class="h_title">
        <h3>热门推荐</h3>
        <div class="tag-box">
          <span
            v-for="(item, index) in playlist_tags"
            :key="item.id"
            :class="index == playlist_index ? 'active' : ''"
            @click="choosePlayListType(index)"
            >{{ item.name }}</span
          >
        </div>
      </div>
      <div class="wrapper">
        <PlayList :playList="playlist_list" :loading="playlist_loading" :total="playlist_count" />
      </div>
    </div>

    <div class="album_list">
      <div class="h_title">
        <h3>新碟上架</h3>
        <div class="tag-box">
          <span
            v-for="(item, index) in album_area"
            :key="item.id"
            :class="index == album_index ? 'active' : ''"
            @click="chooseAlbumType(index)"
            >{{ item.name }}</span
          >
        </div>
      </div>
      <div class="wrapper">
        <AlbumList :albumList="album_list" :loading="album_loading" :height="100" :total="album_count" />
      </div>
    </div>

    <div class="top_list">
      <RankList />
    </div>

    <div class="mv_list">
      <div class="h_title">
        <h3>最新MV</h3>
        <div class="tag-box">
          <span
            v-for="(item, index) in mv_area"
            :key="item.id"
            :class="index == mv_index ? 'active' : ''"
            @click="chooseMvType(index)"
            >{{ item }}</span
          >
        </div>
      </div>
      <div class="wrapper">
        <MvList :mvList="mv_list" :loading="mv_loading" :total="mv_count" />
      </div>
    </div>

    <div class="dj-artist">
      <div class="dj-list">
        <div class="h_title">
          <h3>热门电台</h3>
        </div>
        <DjList />
      </div>
      <div class="artist-list">
        <div class="h_title">
          <h3>热门歌手</h3>
        </div>
        <ArtistList />
      </div>
    </div>
  </div>
</template>

<script setup>
import Banners from './components/Banner.vue'
import PlayList from '@/components/playlist/PlayList.vue'
import AlbumList from '@/components/album/AlbumList.vue'
import RankList from './components/RankList.vue'
import MvList from '@/components/mv/MvList.vue'
import DjList from '@/components/dj/DjList.vue'
import ArtistList from '@/components/artist/ArtistList.vue'

import useHotRecom from '@/composables/useHotRecom'
import useNewAlbum from '@/composables/useNewAlbum.js'
import useNewMv from '@/composables/useNewMv.js'

// -------------- 推荐歌单
const { playlist_tags, playlist_list, playlist_index, playlist_count, playlist_loading, choosePlayListType } =
  useHotRecom()

// -------------- 新碟
const { album_area, album_list, album_index, album_count, album_loading, chooseAlbumType } = useNewAlbum()

// -------------- MV
const { mv_area, mv_list, mv_index, mv_count, mv_loading, chooseMvType } = useNewMv()
</script>
<style lang="less" scoped>
.index {
  margin-left: 20px;
}
.h_title {
  display: flex;
  padding: 20px 0 10px;

  h3 {
    display: inline-block;
    min-width: 70px;
    padding-right: 50px;
    font-size: 28px;
    font-weight: 700;
  }

  .tag-box {
    min-width: 500px;
    span {
      display: inline-block;
      font-size: 16px;
      margin: 3px 40px 0 0;
      color: var(--color-text-main);
      cursor: pointer;

      &.active {
        position: relative;
        z-index: 1;
        font-weight: 600;
        color: var(--color-text-main);

        &:after {
          position: absolute;
          content: '';
          left: 0;
          bottom: 1px;
          width: 100%;
          height: 6px;
          background: var(--color-text-height);
          z-index: -1;
        }
      }
    }
  }
}

.hot-list,
.album_list,
.mv_list,
.dj-list,
.artist-list {
  padding: 0 10px;
  margin-bottom: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
}

.hot-list,
.album_list,
.mv_list {
  min-width: 640px;
}

.top_list {
  margin-bottom: 25px;
}
.dj-artist {
  display: flex;
}
.dj-list {
  flex: 1;
  margin-right: 20px;
}
.artist-list {
  width: 440px;
}
</style>
