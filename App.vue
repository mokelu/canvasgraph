<template>
  <div class="layout">
  <!-- 
    what should appear on the screen.
    inside we are putting 7 components 
    layout
    ├── TopBar
    ├── LeftDock
    ├── LeftContent
    ├── CenterContent
    ├── RightContent
    ├── RightDock
    └── BottomBar
  -->
    <TopBar class="top" />
    <LeftDock class="left-dock" />
    <LeftContent class="left-content" />
    <CenterContent class="center" />
    <RightContent class="right-content" />
    <RightDock class="right-dock" />
    <BottomBar class="bottom" />
  </div>
</template>

<script setup>
import TopBar from './components/layout/TopBar.vue'
import BottomBar from './components/layout/BottomBar.vue'
import LeftDock from './components/layout/LeftDock.vue'
import LeftContent from './components/layout/LeftContent.vue'
import CenterContent from './components/layout/CenterContent.vue'
import RightContent from './components/layout/RightContent.vue'
import RightDock from './components/layout/RightDock.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
}
</style>
