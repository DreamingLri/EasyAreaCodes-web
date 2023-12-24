<script setup>
import {reactive, ref} from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import router from "@/router";

const loginUser = reactive({
  userName: '',
  password: '',
})

function login(){
  request.post("/admin/login", loginUser).then(res=>{
    if(res.code === 200){
      ElMessage.success("登录成功QAQ")
      router.push('/admin/back-stage')
    } else {
      ElMessage.error(res.message)
    }
  })
}
</script>

<template>
  <div class="main-wrapper">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>EAC后台管理</span>
        </div>
      </template>
      <el-input v-model="loginUser.userName" placeholder="Please input" />
      <el-input v-model="loginUser.password" style="margin-top: 10px" type="password" placeholder="Please input password" show-password/>
      <template #footer>
        <el-button type="primary" @click="login" style="width: 100%">Login</el-button>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.main-wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
}
</style>