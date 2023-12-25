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

//多选面板
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

const multipleSelectedTableRef = ref()
const multipleSelectedSelection = ref([])
const toggleSelectedSelection = (rows) => {
  console.log(multipleSelectedSelection.value)
  if (rows) {
    rows.forEach((row) => {
      multipleSelectedTableRef.value.toggleRowSelection(row)
    })
  } else {
    multipleSelectedTableRef.value.clearSelection()
  }
}
const handleSelectedSelectionChange = (val) => {
  multipleSelectedSelection.value = val
}

//编辑面板
const detailsList = ref([])
const detail = ref()
function handleEdit(row){
  let data
  if(row){
    data = row
    request.post("/detail/getDetailByChange" , data).then(res=>{
      if(res.code === 200){
        // console.log(res.data)
        detail.value = res.data
        detailsList.value = []
      } else {
        console.log(res.message)
      }
    })
    console.log(data)
  } else {
    data = multipleSelectedSelection.value
    request.post("/detail/getDetailByChangesList" , data).then(res=>{
      if(res.code === 200){
        detailsList.value = res.data
        detail.value = undefined;
      } else {
        console.log(res.message)
      }
    })
  }
}

//更新Detail

const textarea = ref('')
function updateDetail(){
  detail.value.text = textarea.value
  console.log(detail)
  request.post("detail/updateDetail", detail.value).then(res=>{
    if(res.code === 200){
      ElMessage.success("更新成功")
    } else {
      ElMessage.error(res.message)
    }
  })
}

function updateDetails(){
  console.log(detailsList)
  for (let i = 0; i < detailsList.value.length; i++) {
    detailsList.value[i].text = textarea.value
  }
  request.post("detail/updateDetails" ,detailsList.value).then(res=>{
    if(res.code === 200){
      ElMessage.success("更新成功")
    } else {
      ElMessage.error(res.message)
    }
  })
}

</script>

<template>
<div class="main-wrapper">
  <el-container>
    <el-header class="header">
      <h3>
        EAC后台管理系统
      </h3>

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
                        <el-table-column label="旧代码">
                          <template #default="scope">
                            <div style="display: flex; align-items: center">
                              <el-tag :disable-transitions="true">{{ scope.row.code }}</el-tag>
                              <span style="margin-left: 10px">{{ scope.row.name }}</span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="新代码">
                          <template #default="scope">
                            <div style="display: flex; align-items: center">
                              <el-tag :disable-transitions="true">{{ scope.row.newCode }}</el-tag>
                              <span style="margin-left: 10px">{{ scope.row.newName }}</span>
                            </div>
                          </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 10px">
                      <el-button @click="toggleSelection()" plain>清空选择</el-button>
                      <el-button @click="jumpToEdit()" type="primary" plain>跳转编辑</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="时间">
                <template v-slot="scope">
                  {{scope.row.time-1}} - {{scope.row.time}}
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
      </el-aside>
      <el-main class="main">
        <el-card shadow="hover">
          <el-table :data="editList" style="width: 100%" height="300" @selection-change="handleSelectedSelectionChange" ref="multipleSelectedTableRef">
            <el-table-column type="selection" width="55" />
            <el-table-column label="旧代码">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-tag :disable-transitions="true">{{ scope.row.code }}</el-tag>
                  <span style="margin-left: 10px">{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="新代码">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-tag :disable-transitions="true">{{ scope.row.newCode }}</el-tag>
                  <span style="margin-left: 10px">{{ scope.row.newName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px; display: flex;">
            <el-button @click="toggleSelectedSelection()" plain :disabled="multipleSelectedSelection.length === 0">清空选择</el-button>
            <el-button @click="handleEdit()" type="primary" :disabled="multipleSelectedSelection.length === 0" plain>多选编辑</el-button>
          </div>
        </el-card>
        <div v-if="detailsList.length">
          <el-card shadow="hover" style="margin-top: 10px">
            <div v-for="item in detailsList" style="margin-top: 10px">

              <div style="display: flex; justify-content: center; margin-bottom: 5px">
                <el-tag>{{item.code}}</el-tag>
                <span style="margin-left: 5px">{{item.name}}</span>
                <el-icon style="margin-left: 10px; margin-right: 10px; margin-top: 3px"><DArrowRight /></el-icon>
                <el-tag>{{item.newCode}}</el-tag>
                 <span style="margin-left: 5px">{{item.newName}}</span>
              </div>

              <el-input
                  v-model="item.text"
                  :autosize="{ minRows: 4}"
                  type="textarea"
                  placeholder="无数据"
                  disabled
              />
            </div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 10px">
            <el-input
                v-model="textarea"
                :autosize="{ minRows: 4}"
                type="textarea"
                placeholder="请输入要变更的详情"
            />
            <el-button @click="updateDetails" plain style="margin-top: 10px; display: flex">Update</el-button>
          </el-card>
        </div>
        <div v-else-if="detail">
          <el-card shadow="hover" style="margin-top: 10px" v-if="detail">

            <div v-if="detail" style="display: flex; justify-content: center; margin-bottom: 5px">
              <el-tag>{{detail.code}}</el-tag>
              <span style="margin-left: 5px">{{detail.name}}</span>
              <el-icon style="margin-left: 10px; margin-right: 10px; margin-top: 3px"><DArrowRight /></el-icon>
              <el-tag>{{detail.newCode}}</el-tag>
              <span style="margin-left: 5px">{{detail.newName}}</span>
            </div>

            <el-input
                v-model="detail.text"
                :autosize="{ minRows: 4}"
                type="textarea"
                placeholder="无数据"
                disabled
            />
          </el-card>
          <el-card shadow="hover" style="margin-top: 10px">
            <el-input
                v-model="textarea"
                :autosize="{ minRows: 4}"
                type="textarea"
                placeholder="请输入要变更的详情"
            />
          </el-card>
          <el-button :disabled="!textarea" @click="updateDetail" plain style="margin-top: 10px; display: flex">更新</el-button>
        </div>
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