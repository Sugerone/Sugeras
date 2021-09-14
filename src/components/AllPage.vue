<template>
 <el-scrollbar height="100%" style="height:90%">
    <p class="item" v-for="item in 40" v-bind:key="item.id">{{ item }}</p>
</el-scrollbar>
  <el-pagination
  background
  layout="prev, pager, next"
  :total="1000">
</el-pagination>
</template>

<script>
  export default {
    
  }
</script>