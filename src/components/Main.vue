<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import request from "@/utils/request";
import {ElMessage, ElTree} from "element-plus";

const handleNodeClick = (data) => {
  // console.log(data)
}

const filterText = ref('')
const treeRef = ref();
const currentNode = ref()
const successors = ref([])
const predecessors = ref([])


const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

function showDetails(node, data){
  console.log(data)
  currentNode.value = data
  request.get("code/getSuccessors?code="+data.code+"&start="+data.start).then(res=>{
    if(res.code === 200){
      successors.value = res.data
    } else {
      console.log(res.message)
    }
  })
  request.get("code/getPredecessors?code="+data.code+"&start="+data.start+"&end="+(data.end ? data.end : "") ).then(res=>{
    if(res.code === 200){
      predecessors.value = res.data
    } else {
      console.log(res.message)
    }
  })
}



const defaultProps = {
  children: 'children',
}
onMounted(()=>{
  getCodes()
  console.log(data)
})

function getCodes(){
  request.get("code/getAllCodes").then(res=>{
    if(res.code === 200){
        data.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}

const currentTag = ref('')
function highLight(data){
  currentTag.value = data
}
const detail = ref({
  id: '',
  text: '暂无数据详情'
})

function getDetails(item){
  console.log(item)
  request.get("detail/getDetailByCodeAndNewCodeAndTime?code="+item.code+"&newCode="+item.newCode+"&time="+item.time).then(res=>{
    if(res.code === 200){
      if(res.data){
        detail.value = res.data
      }else {
        detail.value.text = '暂无数据详情'
      }
      // console.log(detail.value[0].text)
    } else {
      ElMessage.error(res.message)
    }
  })
}


const data = reactive([])

</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header style="height: 150px">
        <h1>EasyAreaCodes</h1>
        <h4>中华人民共和国县级以上历史行政区划代码及新旧代码对应关系数据集</h4>
      </el-header>
      <el-container class="main">
        <el-aside width="40%" style="border-right: 1px solid #ccc">
          <div>
            <el-scrollbar class="el-scrollbar">
              <div class="input">
                <el-input v-model="filterText" placeholder="请输入搜索内容" />
              </div>
              <div style="height: 30px; width: 100%;">

              </div>
              <div class="custom-tree">
                <el-tree :data="data.value"
                         :props="defaultProps"
                         @node-click="handleNodeClick"
                         :filter-node-method="filterNode"
                         :expand-on-click-node="false"
                         :accordion="true"
                         :auto-expand-parent="false"
                         ref="treeRef"
                >
                  <template #default="{ node, data }">
              <span class="custom-tree-node" >
                <span :class="{ obsolete: node.data.end }">{{ node.data.code }} &lt;{{node.data.start}}{{node.data.end ? "-" + node.data.end : ""}}&gt; {{node.data.name}}</span>
                <span v-if="node.data.code % 10000 !== 0">
                  <el-button type="primary" style="height: 20px" plain @click="showDetails(node, data)">详情</el-button>
                </span>
              </span>
                  </template>
                </el-tree>
              </div>
            </el-scrollbar>
          </div>
        </el-aside>
        <el-main>
          <el-scrollbar class="el-main-scrollbar">
            <el-row v-if="currentNode" >
              <el-col :span="24">
                <el-card shadow="hover" class="el-card">
                  <template #header>
                  <div class="card-header">
                    <span><el-text style="font-size: 20px" size="large" type="primary"><el-icon style="margin-right: 5px"><Location /></el-icon>本身</el-text></span>
                      <el-tag effect="light" style="font-size: 15px; margin-left: 20px">
                        {{currentNode.code}} &lt;{{currentNode.start}}{{currentNode.end ? "-" + currentNode.end : ""}}&gt; {{currentNode.name}}
                      </el-tag>
                  </div>
                </template>
                  <el-row v-if="currentNode" :gutter="40">
                    <el-col :span="12" >
                      <span><el-text style="font-size: 20px" size="large" type="primary"><el-icon style="margin-right: 5px"><DArrowLeft /></el-icon>前驱</el-text></span>
                      <div v-for="item in predecessors" :key="item" @click="getDetails(item)">
                        <el-tag @click="highLight(item)" :effect="item === currentTag ? 'dark':'light'" class="ml-2" type="info" style="margin-top: 10px; font-size: 15px">
                          {{item.code}} &lt;{{item.time}}&gt; {{item.name}}
                        </el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <span><el-text style="font-size: 20px" size="large" type="primary"><el-icon style="margin-right: 5px"><DArrowRight /></el-icon>后继</el-text></span>
                      <div v-for="item in successors" :key="item" @click="getDetails(item)">
                        <el-tag @click="highLight(item)" :effect="item === currentTag ? 'dark':'light'" class="ml-2" type="success" style="margin-top: 10px; font-size: 15px">
                          {{item.newCode}} &lt;{{item.time}}&gt; {{item.name}}
                        </el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>

            <el-row v-if="currentNode" style="margin-top: 30px">
              <el-col :span="24">
                <el-card class="el-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <span><el-text style="font-size: 20px" size="large" type="primary"><el-icon style="margin-right: 5px"><DataAnalysis /></el-icon>详情</el-text></span>
                    </div>
                  </template>
                  <div style="text-align: left">
                    {{detail.text}}
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-scrollbar>

        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<style scoped>

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.input{
  height: 10%;
}
.custom-tree{
  height: 85%;
}
.main{
  background-color: rgb(255, 255, 255);
  border-top: 1px solid #ccc;
}
.el-scrollbar{
  width: 100%;
  height: calc(100vh - 170px);
  box-sizing: border-box;
  padding: 20px;
}
.el-main-scrollbar{
  width: 100%;
  height: calc(100vh - 195px);
}
.el-scrollbar :deep(.el-menu){
  border-right: 0;
}

.obsolete{
  color: gray;
}
.el-tree{
  color: black;
}

.card-header{
  text-align: left;
}

.el-card{
}
</style>