<script setup>
import {ref} from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";

const loginUser = ref({
  userName: '',
  password: '',
})

function login(){
  request.post("/admin/login", loginUser).then(res=>{
    if(res.code === 200){
      ElMessage.success("登录成功QAQ")
    } else {
      ElMessage.error(res.message)
    }
  })
}
</script>

<template>
  <div class="main-wrapper">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>EAC后台管理</span>
        </div>
      </template>
      <el-input v-model="loginUser.userName" placeholder="Please input" />
      <el-input v-model="loginUser.password" type="password" placeholder="Please input password" show-password/>
      <template #footer>
        <el-button type="primary" @click="login">Login</el-button>
      </template>
    </el-card>
  </div>
</template>

<style scoped>

</style>