<template>
  <el-container direction="vertical">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content">
            <span>GNY Web Wallet</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content">
            <span>Latest Block Height: {{ blockHeight }}</span>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content">
            <el-button @click="logout" type="info">Logout</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container direction="horizontal">
      <div style="display:relative">
      <el-aside>
        <el-menu
          class="el-menu-vertical"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="1" route="/home">
            <i class="el-icon-s-home"></i>
            <span> Home</span>
          </el-menu-item>

          <el-menu-item index="2" route="/transfer">
            <i class="el-icon-s-promotion"></i>
            <span> Transfer</span>
          </el-menu-item>

          <el-menu-item index="3" route="/delegates">
            <i class="el-icon-user-solid"></i>
            <span> Delegates</span>
          </el-menu-item>

          <el-menu-item index="4" route="/assets">
            <i class="el-icon-s-order"></i>
            <span> Assets</span>
          </el-menu-item>

          <el-menu-item index="5" route="/machinelearning">
            <i class="el-icon-s-platform"></i>
            <span> Machine Learning</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      </div>

      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>

  </el-container>
</template>

<script>
import * as Cookie from 'tiny-cookie';

export default {
  data() {
    return {
      blockHeight: this.$store.getters.latestBlock.height,
    };
  },
  methods: {
    logout() {
      Cookie.remove('bip39');
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #5c89a8;
  color: #fff;
  text-align: justify;
  line-height: 60px;
  font-family: 'Courier New', Courier, monospace;
}

.el-aside {
  top: 60px;
  height: 100%;
  z-index: 100;
  border-right: solid 1px #e6e6e6;
  margin:0px;
}
.el-aside > * {
  border-right: solid 0px;
}

</style>
