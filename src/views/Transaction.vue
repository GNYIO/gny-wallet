<template>
  <el-card>
    <el-form :model="form" ref="form" :rules="rules" label-width="80px">
      <el-form-item label="From">
        <el-input v-model="form.from" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="To" prop="to" required>
        <el-input v-model="form.to"></el-input>
      </el-form-item>

      <el-form-item label="Amount" prop="amount" required>
        <el-input
          type="text"
          v-model="form.amount"
          :placeholder="amountPlaceholder"
        ></el-input>
      </el-form-item>

      <el-form-item label="Message" prop="message">
        <el-input v-model="form.message"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="sendTransaction">Send</el-button>
        <el-button @click="resetForm">Cancel</el-button>
      </el-form-item>
    </el-form>
    </el-card>
</template>

<script>
import { mapState } from 'vuex';
import * as client from '@gny/client';
import { isAddress } from '@gny/utils';
import { BigNumber } from 'bignumber.js';

const connection = new client.Connection(
  process.env['GNY_ENDPOINT'],
  process.env['GNY_PORT'],
  process.env['GNY_NETWORK'],
);

export default {
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
        callback(new Error(`amount too big, you only have "${this.user.balance / 1e8}" available`));
      }
    };

    const validateMessage = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback();
      }

      if (typeof value !== 'string') {
        callback(new Error('message must be a string'));
      }

      if (value.length > 256) {
        callback(new Error('max length is 256'));
      }
      const regex = /^$|(^[a-zA-Z0-9]{1}[a-zA-Z0-9 ]*[a-zA-Z0-9]{1}$)/;
      if (regex.test(value)) {
        callback()
      } else {
        callback('wrong message format')
      }
    };

    return {
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
          { required: true, message: 'Please input to address', trigger: 'blur' },
          { validator: validateAddress, trigger: 'blur' }
        ],
        amount: [
          { validator: validateAmount, trigger: 'blur' }
        ],
        message: [
          { validator: validateMessage, trigger: 'blur' }
        ]

      }
    };
  },
  computed: {
    ...mapState(['user', 'passphrase']),
  },
  methods: {
    async sendTransaction() {

      try {
        const result = await this.$refs['form'].validate();
        console.log(result);
      } catch (err) {
        console.log(`err: ${err}`);
        return; // remove TODOO
      }

      try {
        const trs = client.basic.transfer(
          this.form.to,
          this.form.amount * 1e8,
          this.form.message,
          this.passphrase,
        );
        console.log(trs);
        const response = await connection.api.Transport.sendTransaction(trs);
        console.log(response);
        this.$message(`Transaction id: ${response.transactionId}`);
      } catch (error) {
        console.log(error);
      }
    },
    resetForm() {
      this.$refs['form'].resetFields();
    }
  },
  mounted() {
    this.form.from = this.$store.state.user.address;
    this.amountPlaceholder = `You have ${this.user.balance / 1e8} GNY in your account`;
  },
};
</script>

<style></style>
