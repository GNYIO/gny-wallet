<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card v-if="!positiveBalance">
          <h3>You have currently no GNY to transfer</h3>
        </el-card>

        <el-card v-if="positiveBalance">
          <div slot="header">
            Transfer GNY
          </div>
          <el-form :model="form" ref="form" :rules="rules" label-width="80px">
            <el-form-item label="From">
              <el-tooltip
                effect="light"
                content="Own Address"
                placement="top-start"
              >
                <el-input v-model="form.from" :disabled="true"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="To" prop="to" required>
              <el-tooltip
                effect="light"
                content="Address e.g.: GWrAxgXSiZxieGrLWungJqWe4Xws"
                placement="top-start"
              >
                <el-input v-model="form.to"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="Amount" prop="amount" required>
              <el-tooltip
                effect="light"
                :content="amountPlaceholder"
                placement="top-start"
              >
                <el-input
                  type="text"
                  v-model="form.amount"
                  :placeholder="amountPlaceholder"
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="Message" prop="message">
              <el-tooltip
                effect="light"
                content="Optional message (unencrypted) e.g. 'test message'"
                placement="top-start"
              >
                <el-input v-model="form.message"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <div style="float: left">
                <el-badge
                  value="0.1 GNY"
                  type="info"
                  @mouseover.native="hideTransferBadge = false"
                  @mouseleave.native="hideTransferBadge = true"
                  :hidden="hideTransferBadge"
                >
                  <el-button type="primary" @click="sendTransaction"
                    >Send</el-button
                  >
                </el-badge>
              </div>

              <el-button
                @click="resetForm"
                style="float: left; margin-left: 10px;"
                >Cancel</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <TransfersPaged></TransfersPaged>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as client from '@gny/client';
import { isAddress } from '@gny/utils';
import { BigNumber } from 'bignumber.js';
import TransfersPaged from './TransfersPaged';

const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  process.env.VUE_APP_GNY_PORT,
  process.env.VUE_APP_GNY_NETWORK,
);

export default {
  components: {
    TransfersPaged,
  },
  data() {
    const validateAddress = (rule, value, callback) => {
      if (isAddress(value)) {
        callback();
      } else {
        callback(new Error('not a valid address'));
      }
    };

    const validateAmount = (rule, value, callback) => {
      if (new BigNumber(value).isNaN()) {
        callback('is not a number');
      }

      const currentInput = new BigNumber(value).times(1e8);
      if (currentInput.isLessThan(this.user.balance)) {
        callback();
      } else {
        callback(
          new Error(
            `amount too big, you only have "${this.user.balance /
              1e8}" available`,
          ),
        );
      }
    };

    return {
      hideTransferBadge: true,

      balance: 0,
      amountPlaceholder: '',
      form: {
        from: '',
        to: '',
        amount: '',
        message: '',
      },
      rules: {
        to: [
          {
            required: true,
            message: 'Please input to address',
            trigger: 'blur',
          },
          { validator: validateAddress, trigger: 'blur' },
        ],
        amount: [{ validator: validateAmount, trigger: 'blur' }],
        message: [
          {
            max: 256,
            message: 'Length should not be longer than 256',
            trigger: 'change',
          },
          {
            type: 'string',
            pattern: /^$|(^[a-zA-Z0-9]{1}[a-zA-Z0-9 ]*[a-zA-Z0-9]{1}$)/,
            trigger: 'change',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['user', 'passphrase', 'secondPassphrase']),
    ...mapGetters(['positiveBalance']),
  },
  methods: {
    async sendTransaction() {
      try {
        await this.$refs['form'].validate();
      } catch (err) {
        console.log(`err: ${err}`);
        return; // remove TODOO
      }

      try {
        const result = await connection.contract.Basic.send(
          this.form.to,
          this.form.amount * 1e8,
          this.passphrase,
          this.form.message,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);
        this.$refs['form'].resetFields();
      } catch (error) {
        console.log(error);
      }
    },
    resetForm() {
      this.$refs['form'].resetFields();
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('getTransfers');

    this.form.from = this.$store.state.user.address;
    this.amountPlaceholder = `You have ${this.user.balance /
      1e8} GNY in your account`;
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
