<template>
  <el-upload
    class="avatar-uploader"
    action="http://127.0.0.1:8090/upload_image"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :multiple="multip"
  ><i class="el-icon-plus avatar-uploader-icon"></i>
    <el-row>
      <img v-if="imageList" v-for="(item,index) in imageList" :src="item" class="avatar">
    </el-row>


  </el-upload>
</template>

<style>
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    float: left;
  }
</style>

<script>
  export default {
    props:{
      imageUrl:{
        type:String
      },
      multip:{
        type:Boolean,
        default:false
      },
      imageList:{
        type:Array,
        default: []
      }
    },
    // data() {
    //   return {
    //     imageList: []
    //   };
    // },
    methods: {
      handleAvatarSuccess(res, file) {
        this.$emit("callback",res)
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
