<template>
  <el-col :span="12">
    <el-card v-if="!positiveBalance">
      <div>
        <h3>You need 5 GNY to set your username</h3>
      </div>
    </el-card>

    <el-card v-if="!user.username && positiveBalance">
      <div slot="header">
        <span>Set Username</span>
      </div>

      <el-form
        ref="usernameForm"
        :model="usernameForm"
        label-width="80px"
        :rules="usernameFormRules"
      >
        <el-form-item label="Usern." prop="username">
          <el-input
            v-model="usernameForm.username"
            :disabled="hasUsername"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <div style="float: left">
            <el-badge
              value="5 GNY"
              type="info"
              @mouseover.native="hideSetUsernameBadge = false"
              @mouseleave.native="hideSetUsernameBadge = true"
              :hidden="hideSetUsernameBadge"
            >
              <el-button
                type="primary"
                @click="setUsername"
                :disabled="hasUsername"
                >Set Username</el-button
              >
            </el-badge>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </el-col>
</template>

<script>
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
    positiveBalance: Boolean,
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    return {
      hideSetUsernameBadge: true,
      hasUsername: false,

      usernameForm: {
        username: '',
      },

      usernameFormRules: {
        username: [
          {
            required: true,
            message: 'Please add a username',
            trigger: 'blur',
          },
          {
            type: 'string',
            pattern: /^[a-z0-9_]{2,20}$/,
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    async setUsername() {
      try {
        await this.$refs['usernameForm'].validate();
      } catch (err) {
        console.log('Validation for usernameForm failed');
        return;
      }

      try {
        const result = await connection.contract.Basic.setUserName(
          this.usernameForm.username,
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);
        this.hasUsername = true;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
