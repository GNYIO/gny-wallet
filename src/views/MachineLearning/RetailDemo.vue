<template>
  <el-main>
    <title>Upload CVS DATA File</title>
    <div style="background-color: #5c89a8; color: white; padding: 20px">
      <h1>RETAIL DEMO</h1>
    </div>
    <h2>Predict what will be my next top selling item</h2>
    <br />
    <h3>
      A sales prediction model for retail stores using the deep learning neural
      net given the sales of a particular day for one year, predicts the top
      sales for any following day.
      <br />This is a deep learning model that considers the L1 regularization
      achieved sales forecasting accuracy rate of 86%. <br />The products at the
      retail store have been finely categorized. With classification our genie
      deep learning is able to establish correlations between a persons and a
      product's attributes. <br />Genie Deep Learning maps these input
      attributes to outputs. It finds correlations. <br />It is known as a
      universal approximator, because it can learn to approximate an unknown
      function f(x) = y between any input x and any output y, assuming they are
      related at all by correlation or causation, for example. <br />In the
      process of learning, a neural network finds the right f, or the correct
      manner of transforming x into y.
    </h3>
    <br />
    <h1>Step 1 : Download Example CSV</h1>

    <el-button type="primary" round>
      <a href="https://mlapi.gny.io/get_covid" download="retail_data">
        Download Example CSV</a
      ></el-button
    >

    <br />
    <h1>Step 2 : Upload CSV DATA File</h1>

    <el-form>
      <el-upload
        action="https://mlapi.gny.io/myupfiles"
        :multiple="false"
        :on-change="handleChange"
        :limit="1"
        :auto-upload="true"
        :file-list="fileList"
        :http-request="uploadFiles"
      >
        <el-button slot="trigger" size="small" type="primary"
          >Click to upload</el-button
        >
        <!-- <el-button
        style="margin-left: 10px;"
        size="small"
        type="success"
        :plain="true"
        @click="onSubmit"
        >Upload</el-button
      > -->
        <div slot="tip" class="el-upload__tip">
          Your file must follow the GNY format.
        </div>
      </el-upload>
    </el-form>

    <br />
    <br />
    <h1>Step 3: Run ML Predictions - Automated</h1>

    <el-button type="danger" :plain="true" @click="runPrediction"
      >Run Predictions</el-button
    >

    <br />
    <div v-show="isRunPredictionClicked">
      <h1>Step 4 : Download Predictions CSV</h1>

      <el-button type="danger" round>
        <a
          href="https://mlapi.gny.io/get_pred_3_retail"
          download="prediction_data"
        >
          Get Predictions</a
        ></el-button
      >
    </div>

    <br />
    <el-button type="primary" round>
      <a href="https://mlapi.gny.io/get_retail_ins" download="retail_data">
        Get GNY ML Tech Notes</a
      ></el-button
    >
  </el-main>
</template>

<script>
import axios from 'axios';

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }
export default {
  data() {
    return {
      fileList: [],
      isFileSelected: true,
      isRunPredictionClicked: false,
    };
  },
  methods: {
    handleChange(file, fileList) {
      console.log('changed', fileList);
    },
    uploadFiles(fileList) {
      if (this.isFileSelected) {
        const formData = new FormData();
        // console.log('fileList', fileList.file);

        formData.append('file', fileList.file);

        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios({
          method: 'post',
          url: 'https://mlapi.gny.io/myupfiles',
          data: formData,
        })
          .then(response => {
            this.$message({
              message:
                'Congratulations! You have uploaded your file successfully',
              type: 'success',
            });
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$message({
          message: 'You have to choose one file!',
          type: 'warning',
        });
      }
    },
    runPrediction() {
      this.isRunPredictionClicked = true;
      axios({
        method: 'get',
        url: 'https://mlapi.gny.io/run_pred_batch_2_retail',
      })
        .then(response => {
          this.$message({
            message: 'You can download your predictions now.',
            type: 'success',
          });
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>
