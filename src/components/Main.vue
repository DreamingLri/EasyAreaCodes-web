<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import request from "@/utils/request";
import {ElMessage, ElTree} from "element-plus";

const handleNodeClick = (data) => {
  // console.log(data)
}

const filterText = ref('')
const treeRef = ref();


const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

function showDetails(node, data){
  console.log(data)
}

const defaultProps = {
  children: 'children',
  label: function(data, node) {
    if(!node.data.end){
      return node.data.code + " <" + node.data.start + "> " + node.data.name
    } else {
      return node.data.code + " <" +node.data.start + "-" + node.data.end + "> " + node.data.name
    }

  }
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
          hello
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
  height: calc(100vh - 150px);
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
</style>