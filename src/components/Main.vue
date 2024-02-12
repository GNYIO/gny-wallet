<template>
  <el-container direction="vertical" class="page-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content">
            <span>GNY Web Wallet</span>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content">
            <span>Latest Block Height: {{ latestBlock.height }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <span>Current Network: {{ network }}</span>
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
      <div>
        <el-aside>
          <el-menu class="el-menu-vertical" router>
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

            <el-menu-item index="7" route="/burn">
              <i class="el-icon-delete-solid"></i>
              <span> Burn GNY</span>
            </el-menu-item>

            <el-menu-item index="9" route="/swap-eth-to-mainnet">
              <i class="el-icon-menu"></i>
              <span> Swap ETH to Mainnet</span>
            </el-menu-item>

            <el-menu-item index="10" route="/swap-mainnet-to-eth">
              <i class="el-icon-s-finance"></i>
              <span> Swap Mainnet to ETH</span>
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
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      network: '',
    };
  },
  computed: {
    ...mapGetters(['latestBlock']),
  },
  methods: {
    logout() {
      this.$store.dispatch('resetState', null);
      this.$router.push('/login');
    },
  },
  mounted() {
    const networkEnv = process.env['VUE_APP_GNY_NETWORK'];
    this.network = networkEnv.charAt(0).toUpperCase() + networkEnv.slice(1);
  },
};
</script>

<style scoped>
.page-container {
  position: relative;
  min-height: 100vh;
}

.el-header {
  background-color: #5c89a8;
  color: #fff;
  text-align: justify;
  line-height: 60px;
}

.el-aside {
  top: 60px;
  height: 100%;
  z-index: 100;
  border-right: solid 1px #e6e6e6;
  margin: 0px;
}

.el-aside > * {
  border-right: solid 0px;
}

.el-main {
  text-align: center;
}
</style>
