<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="loginForm" label-position="left" label-width="70px"
             style="margin-left:50px;">
      <el-form-item label="Title" prop="title" label-width="100px">
        <el-input v-model="loginForm.title"/>
      </el-form-item>
      <el-form-item label="Description" prop="description" label-width="100px">
        <el-input type="textarea" v-model="loginForm.description"/>
      </el-form-item>
      <el-form-item label="Publisher" prop="user_id" label-width="100px">
        <el-select v-model="loginForm.user_id" :remote-method="fetchUserInfo" filterable default-first-option remote
                   placeholder="Search user">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cover" prop="cover" label-width="100px">
        <upload :imageUrl="loginForm.cover" @callback="handleAvatarSuccess"></upload>
        <el-input type="hidden" v-model="loginForm.cover"/>
      </el-form-item>
      <el-form-item label="Body" prop="body" label-width="100px">
        <tinymce v-model="loginForm.body" :height="300"/>
      </el-form-item>
      <el-form-item label="Status" prop="status" label-width="100px">
        <el-radio-group v-model="loginForm.status">
          <el-radio :label="1">Publish</el-radio>
          <el-radio :label="2">Draft</el-radio>
          <el-radio :label="3">Deleted</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchUser} from '@/api/user'
  import {create} from '@/api/article'
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload'

  export default {
    components: {Tinymce, Upload},
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          2: 'gray',
          3: 'danger'
        }
        return statusMap[status]
      },
      statusTextFilter(status) {
        const statusMap = {
          1: "publish",
          2: "draft",
          3: "deleted"
        }
        return statusMap[status]
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(new Error(rule.field + '为必传项'))
        } else {
          callback()
        }
      }
      return {

        list: null,
        listLoading: true,
        uploadVisible: false,
        rules: {
          title: [{validator: validateRequire}],
          description: [{validator: validateRequire}],
          user_id: [{validator: validateRequire}],
          body: [{validator: validateRequire}],
          status: [{validator: validateRequire}],
          cover: [{validator: validateRequire}],
        },
        loginForm: {
          title: "",
          description: "",
          cover: '',
          user_id: "",
          body: "",
          status: 1
        },
        userList: [],
        temp: {
          id: undefined,
          title: "",
          description: '',
          body: ""
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit'
        },
        dialogPvVisible: false,
      }
    },
    created() {
      // this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getList().then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      fetchUserInfo(query) {
        if (query) {
          fetchUser(query).then(res => {
            this.userList = res.data
          })
        }
      },
      onSubmit() {
        create(this.loginForm).then(res => {
          this.$notify({
            title: 'Success',
            message: 'Create Successfully',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: '/article/index'})
        })
      },
      updateData() {
        update(this.temp).then(res => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, res.data)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleClick(row) {
        this.temp.id = row.id
        this.temp.title = row.title
        this.temp.description = row.description
        this.dialogFormVisible = true
      },
      handleUpload() {
        this.uploadVisible = true
      },
      handleAvatarSuccess(res) {
        this.loginForm.cover = process.env.VUE_APP_BASE_API + "/" + res.data;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>
<style scoped>
  .avatar {
    width: 100px;
    height: 100px;
    /*border-radius: 50%*/
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
