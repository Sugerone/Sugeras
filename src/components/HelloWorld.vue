<template>
  <el-container style="height: 100%">
    <el-aside width="400px">
      <el-menu
        default-active="3-1"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
      >
        <el-sub-menu index="1">
          <template #title>
            <i class="el-icon-date"></i>
            <span>日历</span>
          </template>
          <el-calendar v-model="value"> </el-calendar>
        </el-sub-menu>

        <el-menu-item index="2" @click="toMark">
          <i class="el-icon-edit"></i>
          <template #title>记笔记</template>
        </el-menu-item>

        <el-sub-menu index="3">
          <template #title>
            <i class="el-icon-notebook-1"></i>
            <span>我的笔记</span>
          </template>
          <el-menu-item index="3-1" @click="toAll">全部</el-menu-item>
          <el-menu-item index="3-2">日常</el-menu-item>
          <el-menu-item index="3-3">学习</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- header  -->
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click="out()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>{{ username }}</span>
      </el-header>
      <!-- Main -->
      <el-main>
        <div v-if="type === 'A'">
          <!-- <v-md-editor v-model="text" height="400px"></v-md-editor> -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            label-position="left"
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="kind">
              <el-select v-model="ruleForm.kind" placeholder="请选择笔记类型">
                <el-option label="日常" value="daily"></el-option>
                <el-option label="学习" value="study"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="describe">
              <el-input type="textarea" v-model="ruleForm.describe"></el-input>
            </el-form-item>

            <el-form-item label="内容" prop="body">
              <v-md-editor v-model="ruleForm.body" height="400px"></v-md-editor>
            </el-form-item>

            <!-- <el-form-item label="封面" prop="pa">
              <el-upload
                action="#"
                :auto-upload="false"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog v-model="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item> -->

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即创建</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <router-view name="MarkPage"></router-view> -->
        <div v-else-if="type === 'B'" style="width: 100%">
          <el-scrollbar>
            <el-table
              style="width: 100%"
              :data="
                Articles.slice(
                  (currentPage - 1) * pagesize,
                  currentPage * pagesize
                )
              "
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column label="标题" prop="title" width="180">
              </el-table-column>
              <el-table-column label="类别" prop="kind" width="180">
              </el-table-column>
              <el-table-column label="描述" prop="describe" width="300">
              </el-table-column>
              <el-table-column
                label="发布时间"
                :formatter="dateFormat"
                prop="publish"
                width="250"
              >
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button
                    size="mini"
                    @click.prevent="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="Articles.length"
          >
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog title="日记详情" v-model="dialogFormVisible" width="50%">
    <el-form :model="Row" label-position="left">
      <el-form-item label="标题">
        <el-input v-model="Row.title" style="width: 75%"></el-input>
      </el-form-item>

      <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="Row.publish"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker
            placeholder="选择时间"
            v-model="Row.publish"
            style="width: 100%"
          ></el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="类别" prop="kind">
        <el-select v-model="Row.kind" placeholder="请选择类别">
          <el-option label="日常" value="daily"></el-option>
          <el-option label="学习" value="study"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="describe">
        <el-input type="textarea" v-model="Row.describe"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="body">
        <v-md-editor v-model="Row.body" height="400px"></v-md-editor>
      </el-form-item>

      <el-form-item label="封面" prop="pa">
        <el-upload
          action="#"
          :auto-upload="false"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateArticle()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import moment from "moment";
import { ElMessage } from "element-plus";
import Axios from "axios";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      // activeIndex: "1",
      text: "",
      isCollapse: true,
      value: new Date(),
      type: "A",
      username: localStorage.getItem("username"),
      currentPage: 1,
      pagesize: 10,
      Articles: [],
      dialogFormVisible: false,
      Row: {},
      dialogVisible: false,
      ruleForm: {
        title: "",
        kind: "",
        body: "",
        describe: "",
        image: "",
      },
      rules: {
        title: [
          { required: true, message: "请输入笔记标题", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10个字符",
            trigger: "blur",
          },
        ],
        kind: [{ required: true, message: "请选择类型", trigger: "change" }],
        body: [
          {
            required: true,
            message: "请记录内容",
            trigger: "change",
          },
        ],
        describe: [{ required: true, message: "输入描述", trigger: "change" }],
      },
    };
  },
  created() {
    // this.handleArticlesList();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          const token = "jwt " + localStorage.getItem("token");
          Axios.post(
            "http://127.0.0.1:8000/articles/",
            {
              title: this.ruleForm.title,
              kind: this.ruleForm.kind,
              body: this.ruleForm.body,
              describe: this.ruleForm.describe,
            },
            {
              headers: {
                authorization: `${token}`,
              },
            }
          ).then(
            (res) => {
              console.log(res);
              ElMessage.success({
                message: "保存成功",
                type: "success",
                showClose: true,
              });
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    updateArticle() {
      const token = "jwt " + localStorage.getItem("token");
      Axios.put(
        "http://127.0.0.1:8000/articles/" + this.Row.id + "/",
        {
          title: this.Row.title,
          describe: this.Row.describe,
          kind: this.Row.kind,
          body: this.Row.body,
          user: this.Row.user,
        },
        {
          headers: {
            authorization: `${token}`,
          },
        }
      )
        .then((response) => {
          console.log(response);
          ElMessage.success({
            message: "修改成功",
            type: "success",
            showClose: true,
          });
          this.dialogFormVisible = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.Row = row;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      // console.log(index, row);
      this.Row = row;
      const token = "jwt " + localStorage.getItem("token");
      Axios.delete("http://127.0.0.1:8000/articles/" + this.Row.id + "/", {
        headers: {
          authorization: `${token}`,
        },
      })
        .then((res) => {
          console.log(res);
          this.handleArticlesList();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toMark() {
      this.type = "A";
    },
    toAll() {
      this.type = "B";
      this.handleArticlesList();
      // console.log(this.Articles);
    },
    out() {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      this.$router.push("/Login");
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    handleArticlesList() {
      const token = "jwt " + localStorage.getItem("token");
      Axios.get("http://127.0.0.1:8000/articles/getArticlesByUser/", {
        headers: {
          authorization: `${token}`,
        },
      }).then(
        (res) => {
          console.log(res);
          this.Articles = res.data;
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
  // setup() {
  //   const router = useRouter();
  //   const toMarkPage = () => {
  //     router.push({
  //       name: "MarkPage",
  //     });
  //   };
  //   const toAllPage = () => {
  //     router.push({
  //       name: "AllPage",
  //     });
  //   };
  //   return {
  //     toMarkPage,
  //     toAllPage,
  //   };
  // },
};
</script>
<style >
.el-header {
  background-color: #f2f6fc;
  line-height: 60px;
}
</style>
<style>
.el-calendar-table .el-calendar-day {
  height: 60px;
}
</style>