<template>
  <div>
    <el-select v-model="value" placeholder="Please choose an algorithm">
      <el-option
        v-for="item in contracts"
        :key="item.type"
        :label="item.label"
        :value="item.type"
        :auto-upload="false"
      ></el-option>
    </el-select>

    <el-upload
      class="upload-demo"
      ref="upload"
      action="https://testnet.gny.io"
      :auto-upload="false"
      :on-change="readFile"
      :file-list="fileList"
      v-if="value === 201"
    >
      <el-button slot="trigger" size="small" type="primary">Select a file</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">Upload</el-button>
      <div slot="tip" class="el-upload__tip">Your file must follow the GNY format.</div>
    </el-upload>

    <el-button style="margin-left: 10px;" type="primary" @click="callContract">Call Contract</el-button>
  </div>
</template>

<script>
import * as axios from 'axios';
export default {
  data() {
    return {
      contracts: [
        {
          type: 201,
          label: 'uploadData',
        },
        {
          type: 202,
          label: 'getPrediction',
        },
        {
          type: 206,
          label: 'neuralNetworkKeywords',
        },
        {
          type: 207,
          label: 'fraudDetection',
        },
        {
          type: 208,
          label: 'locationPrediction',
        },
      ],
      value: '',
      fileList: [],
      mlData: [],
    };
  },
  methods: {
    readFile(file) {
      const that = this;
      const reader = new FileReader();
      reader.readAsBinaryString(file.raw);
      reader.onload = function(e) {
        const data = e.target.result;
        for (let item of data.split('\n')) {
          that.mlData.push(item.split(','));
        }
        console.log(that.mlData);
      };
    },
    submitUpload: function() {
      if (!this.value) {
        this.$message('You must choose an machine learning algorithm.');
      }
    },
    async callContract() {
      try {
        const response = await axios.put(
          'http://47.56.249.209:4096/api/exchange',
          {
            secret:
              'grow pencil ten junk bomb right describe trade rich valid tuna service',
            fee: '10000000',
            type: this.value,
            args: [],
            message: '',
          },
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.el-select {
  margin-bottom: 30px;
}
</style>
