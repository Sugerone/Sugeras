<template>
  <el-container>
    <el-header>笔记</el-header>
    <el-main style=" text-align: center;">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>用户登录</span>
            <!-- <el-button class="button" type="text">操作按钮</el-button> -->
          </div>
        </template>
        <el-form
          :model="form"
          :rules="rules"
          label-width="100px"
          label-position="top"
          ref="form"
        >
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="form.name" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="form.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')"
              >登录</el-button
            >
            <el-button @click="resetForm('form')">清空</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>
<script>
import { useRouter } from "vue-router";
import Axios from "axios";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
      },
      rules: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          const router = this.$router;
          const user = this.form.name;
          Axios.post("http://127.0.0.1:8000/login/", {
            username: this.form.name,
            password: this.form.password,
          })
            .then(function (response) {
              // console.log(response);
              localStorage.setItem("username", user);
              localStorage.setItem("token", response.data["token"]);
              ElMessage.success({
                message: "登录成功",
                type: "success",
                showClose: true,
              });
              router.push("/");
            })
            .catch(function (error) {
              console.log(error);
               ElMessage.error({
                message: "用户名或密码错误",
                type: "error",
                showClose: true,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  setup() {
    const router = useRouter();
    const toHome = () => {
      router.push({
        name: "Home",
      });
    };
    return {
      toHome,
    };
  },
};
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  margin: 0 auto;
}

/* .el-main {
  text-align: center;
} */
</style>