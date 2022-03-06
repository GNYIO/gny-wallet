<template>
  <el-col :span="12">
    <el-card shadow="hover">
      <div slot="header">
        Issuer
      </div>

      <p>
        Name: <b>{{ issuer.name }}</b>
      </p>
      <p>
        Description: <b>{{ issuer.desc }}</b>
      </p>
    </el-card>
  </el-col>
</template>

<script>
export default {
  props: {
    issuer: Object,
  },
};
</script>
