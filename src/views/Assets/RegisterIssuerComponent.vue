<template>
  <el-col :span="12">
    <el-card v-if="!positiveBalance">
      <h3>You need 100 GNY to register as issuer</h3>
    </el-card>

    <el-card v-if="positiveBalance">
      <div slot="header">Register as Issuer</div>
      <el-form
        ref="registerIssuerForm"
        :model="registerIssuerForm"
        :rules="registerIssuerFormRules"
        label-width="80px"
      >
        <el-form-item label="Name" prop="name">
          <el-tooltip
            effect="light"
            content="Example: AAA"
            placement="top-start"
          >
            <el-input
              v-model="registerIssuerForm.name"
              :disabled="alreayRegisteredIssuer"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Desc." prop="description">
          <el-tooltip
            effect="light"
            content="Description"
            placement="top-start"
          >
            <el-input
              v-model="registerIssuerForm.description"
              :disabled="alreayRegisteredIssuer"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <div style="float: left;">
            <el-badge
              value="100 GNY"
              type="info"
              @mouseover.native="hideRegisterIssuerBadge = false"
              @mouseleave.native="hideRegisterIssuerBadge = true"
              :hidden="hideRegisterIssuerBadge"
            >
              <el-button
                type="primary"
                @click="registerIssuer"
                :disabled="alreayRegisteredIssuer"
                >Register Issuer</el-button
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
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    return {
      alreayRegisteredIssuer: false,

      hideRegisterIssuerBadge: true,

      registerIssuerForm: {
        name: '',
        description: '',
      },

      registerIssuerFormRules: {
        name: [
          {
            required: true,
            message: 'Please add a name',
            trigger: 'blur',
          },
          {
            type: 'string',
            pattern: /^[A-Za-z]{1,16}$/,
            trigger: 'change',
          },
        ],
        description: [
          {
            required: true,
            message: 'Please add a description',
            trigger: 'blur',
          },
          {
            max: 4096,
            message: 'Length should not be longer than 4096',
            trigger: 'blur',
          },
        ],
        maximum: [
          {
            required: true,
            message: 'Please add a maximum',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    async registerIssuer() {
      try {
        const name = this.registerIssuerForm.name;
        const description = this.registerIssuerForm.description;

        const trs = await connection.contract.Uia.registerIssuer(
          name,
          description,
          this.passphrase,
          this.secondPassphrase,
        );

        this.$message(trs.transactionId);
        this.alreayRegisteredIssuer = true;
      } catch (err) {
        console.log(err.message);
      }
    },
  },
};
</script>
