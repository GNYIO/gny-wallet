<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card v-if="!positiveBalance">
          <h3>You have currently no GNY to burn</h3>
        </el-card>

        <el-card v-if="positiveBalance">
          <div slot="header">
            Burn GNY
          </div>

          <el-form :model="burnForm" ref="burnForm" :rules="burnRules" label-width="80px">
            <el-form-item label="Amount" prop="amount">
              <el-input prop v-model="burnForm.amount"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                  type="primary"
                  @click="sendTransaction"
                  style="float: left;"
              >Burn GNY</el-button>

            </el-form-item>
          </el-form>

        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div slot="header">
            GNY Token Supply
          </div>
          Current Supply: <b>{{ supply }} GNY</b>
          <br/><br/>
          Already Burned: <b>{{ burned }} GNY</b>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <BurnPagedComponent></BurnPagedComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { showErrorPopup } from '../../helpers/errorDisplay';
import { mapGetters, mapState } from 'vuex';
import { BigNumber } from 'bignumber.js';
import * as client from '@gny/client';
import BurnPagedComponent from './BurnPagedComponent';


const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

export default {
  components: {
    BurnPagedComponent,
  },
  computed: {
    ...mapState(['user', 'passphrase', 'secondPassphrase']),
    ...mapGetters(['positiveBalance', 'supply', 'burned']),
  },
  data() {
    const validateBurnAmount = (rule, value, callback) => {
      if (new BigNumber(value).isNaN()) {
        return callback('is not a number');
      }

      const currentInput = new BigNumber(value).times(1e8);
      if (currentInput.isLessThan(this.user.balance) === false) {
        return callback(
          new Error(
            `amount too big, you only have "${this.user.balance /
            1e8}" available`,
          ),
        );
      }

      const oneMillion = new BigNumber(String(1000000 * 1e8));
      if (currentInput.isGreaterThan(oneMillion)) {
        return callback(
          new Error('you can not burn more than one million at once')
        );
      } else {
        return callback();
      }
    };

    return {
      burnForm: {
        amount: '',
      },
      burnRules: {
        amount: [
          {
            required: true,
            message: 'A amount is required',
          },
          {
            pattern: /^[1-9][0-9]*$/,
            message: 'must be a valid integer',
            trigger: 'change',
          },
          {
            validator: validateBurnAmount,
            trigger: 'change',
          }
        ]
      },
    };
  },
  methods: {
    async sendTransaction() {
      try {
        await this.$refs['burnForm'].validate();
      } catch (err) {
        console.log(`err: ${err}`);
        return; // remove TODOO
      }

      try {
        // if we press "OK" it returns normally
        // if we press "Cancel" or "X" (close) a error is thrown
        const am = this.burnForm.amount;
        console.log(`amount: ${am}`);
        await this.$confirm(
          `Are you sure that you want to burn "${am}" GNY?`,
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        );
      } catch (err) {
        this.$refs['burnForm'].resetFields();

        this.$message({
          message: 'Burning canceled!',
          type: 'error',
        });
        return;
      }

      try {
        const amount = this.burnForm.amount;
        console.log(`burn amount: ${amount}`);
        const result = await connection.contract.Basic.burn(
          new BigNumber(amount).multipliedBy(1e8).toFixed(),
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);
        this.$refs['burnForm'].resetFields();
      } catch (err) {
        showErrorPopup.apply(this, [err]);
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('getSupply');

    console.log(`this.user: ${this.user.address}`);
    console.log(this.positiveBalance);
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
