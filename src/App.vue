<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
/* set font-family for whole project */
#app {
  font-family: 'Courier New', Courier, monospace;
}

/* global background-color for .el-main */
.el-main {
  background-color: #f9fafb;
}

.custom-notification-style {
  width: auto;
}
</style>
