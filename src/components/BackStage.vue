<script setup>
import {onMounted, ref} from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";

const changeList = ref([])

function getChangeList(){
  request.get('/change/getChangesWithTime').then(res=>{
    if(res.code === 200){
      changeList.value = res.data
    } else {
      ElMessage.error(res.code + res.message)
    }
  })
}

onMounted(()=>{
  getChangeList()
})

const multipleTableRef = ref()
const multipleSelection = ref([])
const toggleSelection = (rows) => {
  console.log(multipleSelection.value)
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value.toggleRowSelection(row)
    })
  } else {
    multipleTableRef.value.clearSelection()
  }
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const editList = ref([])
function jumpToEdit(){
  editList.value = multipleSelection.value
}
</script>

<template>
<div class="main-wrapper">
  <el-container>
    <el-header class="header">
      EAC后台管理系统
    </el-header>
    <el-container>
      <el-aside width="40%" class="aside">
          <el-scrollbar class="el-scrollbar">
            <el-table :data="changeList" style="width: 100%" >
              <el-table-column type="expand">
                <template #default="props">
                  <div>
                    <el-table :data="props.row.family" @selection-change="handleSelectionChange" ref="multipleTableRef">
                        <el-table-column type="selection" width="55" />
                        <el-table-column label="Code" prop="code" />
                        <el-table-column label="Start" prop="start" />
                        <el-table-column label="NewCode" prop="newCode" />
                    </el-table>
                    <div style="margin-top: 10px">
                      <el-button @click="toggleSelection()" plain>Clear selection</el-button>
                      <el-button @click="jumpToEdit()" type="primary" plain>Jump to Edit</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Time" prop="time" />
            </el-table>
          </el-scrollbar>
      </el-aside>
      <el-main class="main">
        <el-card shadow="hover">
          <el-table :data="editList" style="width: 100%">
            <el-table-column label="Code" prop="code"/>
            <el-table-column label="Start" prop="start"/>
            <el-table-column label="Time" prop="time"/>
            <el-table-column label="NewCode" prop="newCode"/>
            <el-table-column label="Operations">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<style scoped>
.header{
  height: 100px;
}
.main-wrapper{
  height: 100vh;
}
.main{
  height: calc(100vh - 100px);
}
.aside{
}
.el-scrollbar{
  width: 100%;
  height: calc(100vh - 100px);
  box-sizing: border-box;
  padding: 20px;
}
</style>