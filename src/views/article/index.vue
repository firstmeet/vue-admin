<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" style="margin-bottom: 20px">
        <router-link :to="'/article/add'">
          <el-button type="primary" icon="el-icon-document-add">新增</el-button>
        </router-link>

      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Title" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="Cover" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.cover">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="Publisher" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.user.name }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusTextFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="CreatedAt" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="UpdatedAt" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <!--          <el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style="width: 700px; margin-left:50px;">
        <el-form-item label="Title" prop="title" label-width="100px">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item label="Description" prop="description" label-width="100px">
          <el-input type="textarea" v-model="temp.description"/>
        </el-form-item>

        <el-form-item label="Cover" prop="cover" label-width="100px">
          <upload :imageUrl="temp.cover" @callback="handleAvatarSuccess"></upload>
        </el-form-item>
        <el-form-item label="Body" prop="body" label-width="100px">
          <tinymce v-model="temp.body" :height="300"/>
        </el-form-item>
        <el-form-item label="Status" prop="status" label-width="100px">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">Publish</el-radio>
            <el-radio :label="2">Draft</el-radio>
            <el-radio :label="3">Deleted</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="upload" :visible.sync="uploadVisible">
      <el-upload
        class="avatar-uploader"
        action="http://127.0.0.1:8090/upload_image"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
  import {getList, update} from '@/api/article'
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
      return {
        list: null,
        listLoading: true,
        uploadVisible: false,
        width: "500",
        temp: {
          id: undefined,
          title: "",
          description: '',
          cover: "",
          body: "",
          status: "1"
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
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getList().then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      handleUpload() {
        this.uploadVisible = true
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
        this.temp.body = row.body
        this.temp.status = row.status
        this.temp.cover = row.cover
        this.dialogFormVisible = true
      },
      handleUpload() {
        this.uploadVisible = true
      },
      handleAvatarSuccess(res) {
        this.uploadVisible = false
        this.temp.cover = process.env.VUE_APP_BASE_API + "/" + res.data;

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
    border-radius: 50%
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
