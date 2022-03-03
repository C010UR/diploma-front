<template>
  <el-container>
    <el-aside style="background-color: white" class="line">
      <base-menu></base-menu>
    </el-aside>
    <el-container style="background-color: white">
      <el-header>Header</el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { ElContainer, ElAside, ElHeader, ElMain, ElFooter } from "element-plus";
import BaseMenu from "../components/BaseMenu.vue";

export default {
  components: {
    ElContainer,
    ElAside,
    ElHeader,
    ElMain,
    ElFooter,
    BaseMenu
  },
  setup() {}
};
</script>
