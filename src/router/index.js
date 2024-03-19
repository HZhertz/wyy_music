import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', name: 'index', component: () => import('@/views/index/index.vue') },
  { path: '/rank', name: 'rank', component: () => import('@/views/rank/index.vue') },
  { path: '/playlist', name: 'playlist', component: () => import('@/views/playlist/index.vue') },
  {
    path: '/playlist/detail',
    name: 'playlistdetail',
    component: () => import('@/views/playlist/Detail.vue'),
  },
  { path: '/mv', name: 'mv', component: () => import('@/views/mv/index.vue') },
  { path: '/mv/detail', name: 'mvdetail', component: () => import('@/views/mv/Detail.vue') },
  { path: '/artist', name: 'artist', component: () => import('@/views/artist/index.vue') },
  { path: '/artist/detail', name: 'artistdetail', component: () => import('@/views/artist/Detail.vue') },
  { path: '/song', name: 'song', component: () => import('@/views/song/index.vue') },
  { path: '/album', name: 'album', component: () => import('@/views/album/index.vue') },
  { path: '/dj', name: 'dj', component: () => import('@/views/dj/index.vue') },
  { path: '/search', name: 'search', component: () => import('@/views/search/index.vue') },
  { path: '/user', name: 'user', component: () => import('@/views/user/index.vue') },
  { path: '/my', name: 'my', component: () => import('@/views/my/index.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
