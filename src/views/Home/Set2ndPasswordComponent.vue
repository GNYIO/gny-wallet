<template>
  <div class="top">
    <el-card v-if="!positiveBalance" shadow="hover">
      <div slot="header">You need 5 GNY to set a second password</div>
    </el-card>

    <el-card v-if="!hasSecondPassphrase && positiveBalance" shadow="hover">
      <div slot="header">
        <span>Set Second password</span>
      </div>

      <el-form
        ref="secondPassphraseForm"
        :model="secondPassphraseForm"
        label-width="80px"
        :rules="secondPassphraseFormRules"
      >
        <el-form-item label="2nd P." prop="secondPassphrase">
          <el-tooltip
            effect="light"
            content="Second Passphrase"
            placement="top-start"
          >
            <el-input
              :disabled="isSecondPassphrase"
              v-model="secondPassphraseForm.secondPassphrase"
            ></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item>
          <div style="float: left">
            <el-badge
              value="5 GNY"
              type="info"
              @mouseover.native="hideSetSecondPassphraseBadge = false"
              @mouseleave.native="hideSetSecondPassphraseBadge = true"
              :hidden="hideSetSecondPassphraseBadge"
            >
              <el-button
                type="primary"
                @click="setSecondPassphrase"
                :disabled="isSecondPassphrase"
                >Set Second Passphrase</el-button
              >
            </el-badge>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { showErrorPopup } from '../../helpers/errorDisplay';
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

export default {
  props: {
    user: Object,
    positiveBalance: Boolean,
    hasSecondPassphrase: Boolean,
    passphrase: String,
  },
  data() {
    return {
      isSecondPassphrase: false,
      hideSetSecondPassphraseBadge: true,

      secondPassphraseForm: {
        secondPassphrase: '',
      },
      secondPassphraseFormRules: {
        secondPassphrase: [
          {
            required: true,
            message: 'Please add a second passphrase',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    async setSecondPassphrase() {
      try {
        await this.$refs['secondPassphraseForm'].validate();
      } catch (err) {
        console.log('Validation for secondPassphraseForm failed');
        return;
      }

      try {
        const secondPassphrase = this.secondPassphraseForm.secondPassphrase;
        const result = await connection.contract.Basic.setSecondPassphrase(
          this.passphrase,
          secondPassphrase,
        );
        this.$message(result.transactionId);

        // disable button and input
        this.isSecondPassphrase = true;

        await this.$store.dispatch('setSecondPassphrase', secondPassphrase);
        await this.$store.dispatch('refreshAccounts');
      } catch (err) {
        showErrorPopup.apply(this, [err]);
      }
    },
  },
};
</script>

<style scoped>
.top {
  text-align: left;
  width: 500px;
  max-width: 500px;
  margin: 0 auto;
}

.top {
  margin-top: 20px;
}
</style>
