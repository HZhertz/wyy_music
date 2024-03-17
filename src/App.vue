<template>
  <el-container>
    <el-aside>
      <Sidebar />
    </el-aside>
    <el-main>
      <Header />
      <router-view></router-view>
    </el-main>
    <Login v-show="loginDialogVisible" />
    <PlayBar />
  </el-container>
</template>

<script setup>
import Sidebar from '@/views/layout/Sidebar.vue'
import Header from '@/views/layout/Header.vue'
import Login from '@/views/layout/Login.vue'
import PlayBar from '@/views/layout/PlayBar.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const loginDialogVisible = computed(() => store.getters.loginDialogVisible)
</script>

<style></style>
