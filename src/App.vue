<template>
  <el-container>
    <el-aside><Sidebar /></el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>

<style></style>
