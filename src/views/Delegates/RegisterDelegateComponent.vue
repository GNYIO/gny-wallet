<template>
  <el-col :span="12">
    <el-card v-if="user.isDelegate === 0 && user.username !== null">
      <div slot="header">
        <span>Register Delegate</span>
      </div>

      <el-form ref="form" :model="form">
        <el-form-item>
          <el-badge
            value="100 GNY"
            type="info"
            @mouseover.native="hideRegisterDelegateBadge = false"
            @mouseleave.native="hideRegisterDelegateBadge = true"
            :hidden="hideRegisterDelegateBadge"
          >
            <el-button
              type="primary"
              @click="registerAsDelegate"
              :disabled="alreadyDelegate"
              >Register as Delegate</el-button
            >
          </el-badge>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="user.isDelegate === 0 && user.username === null">
      <h3>
        Set your username before registering as Delegate
      </h3>
      <p>Lock your account here:</p>
      <router-link to="/home">Home</router-link>
    </el-card>
  </el-col>
</template>

<script>
import { showErrorPopup } from '../../helpers/errorDisplay';
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  process.env.VUE_APP_HTTPS || false,
);

export default {
  props: {
    user: Object,
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    return {
      alreadyDelegate: false,

      hideRegisterDelegateBadge: true,

      form: {},
    };
  },
  methods: {
    async registerAsDelegate() {
      try {
        const result = await connection.contract.Basic.registerDelegate(
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);

        this.alreadyDelegate = true;
      } catch (err) {
        showErrorPopup.apply(this, [err]);
      }
    },
  },
};
</script>
