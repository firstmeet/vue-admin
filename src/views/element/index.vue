<template>
  <div class="app-container">
    <el-row style="margin-bottom: 20px">
      <el-col :span="24"><div class="grid-content bg-purple-dark"><el-button type="primary" @click="create()">创建</el-button></div></el-col>
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
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.picture" class="image">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="资源id"  align="center">
        <template slot-scope="scope">
        {{scope.row.media}}
        </template>
      </el-table-column >
      <el-table-column label="排序"  align="center">
        <template slot-scope="scope">
          {{scope.row.sort}}
        </template>
      </el-table-column>

      <!--      <el-table-column class-name="status-col" label="Status" width="110" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.created_at }}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="Title" prop="title" label-width="100px">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item label="类型" prop="type" label-width="100px">
          <el-radio v-model="temp.type" label="1">图片</el-radio>
          <el-radio v-model="temp.type" label="2">资源</el-radio>
		  <el-radio v-model="temp.type" label="3">链接</el-radio>
        </el-form-item>
        <el-form-item label="图片" v-if="temp.type==1" prop="picture" label-width="100px">
          <upload :imageUrl="temp.picture" :class="upload_class" @callback="handleAvatarSuccess"></upload>
        </el-form-item>
        <el-form-item label="资源" v-if="temp.type==2" prop="media" label-width="100px">
        <el-input v-model="temp.media"/>
      </el-form-item>
      <el-form-item label="链接" v-if="temp.type==3" prop="link" label-width="100px">
        <el-input v-model="temp.link"/>
      </el-form-item>
        <el-form-item label="排序" prop="sort" label-width="100px">
          <el-input v-model="temp.sort"/>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio v-model="temp.status" label="1">启用</el-radio>
          <el-radio v-model="temp.status" label="2">禁用</el-radio>
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

  </div>
</template>

<script>
  import {update,create,getList} from '@/api/element'
  import Upload from '@/components/Upload'

  export default {
    components: {Upload},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        listLoading: true,
        uploadVisible: false,
        upload_class:"avatar-uploader",
        type:[
          {"id":1,"text":"图片"},
          {"id":2,"text":"资源"},
		  {"id":3,"text":"链接"}
          ],
        temp: {
          id: undefined,
          title: "",
          picture: '',
          type:"1",
          media: '',
          link:'',
          sort:"1",
          status:"1",
          created_at:""
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
      create(){
        this.dialogFormVisible=true;
        this.dialogStatus="create"
      },
      createData(){
        create(this.temp).then(res=>{
          this.list.push(res.data)
        })
        this.dialogFormVisible=false;
      },
      updateData() {
        update(this.temp).then(res => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
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
        // this.temp.id = row.id
        // this.temp.name = row.name
        // this.temp.avatar = row.avatar
        this.temp.id=row.id
        this.temp.title=row.title
        this.temp.picture=row.picture
        this.temp.type=row.type.toString()
        this.temp.status=row.status.toString()
        this.temp.media=row.media.toString()
        this.temp.link=row.link.toString()
        this.temp.sort=row.sort.toString()
        this.temp.created_at=row.created_at
        this.dialogFormVisible = true
      },
      handleUpload() {
        this.uploadVisible = true
      },
      handleAvatarSuccess(res, file) {
        this.uploadVisible = false
        this.temp.picture = process.env.VUE_APP_BASE_API + "/" + res.data;
      },
    }
  }
</script>
<style scoped>
.image{
  width: 200px;
  height: 150px;
}
</style>
