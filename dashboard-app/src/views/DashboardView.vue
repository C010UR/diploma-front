<template>
  <el-container>
    <el-aside style="background-color: white" class="line">
      <base-menu></base-menu>
    </el-aside>
    <el-container style="background-color: white">
      <el-header>Header</el-header>
      <el-main style="padding: 0">
        <dashboard-table></dashboard-table>
      </el-main>
      <el-footer height="4rem">
        <div style="margin-left: auto; margin-right: 0">
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100, 200]"
            background
            layout="total, sizes, prev, pager, next"
            :total="totalRows"
            style="margin-top: 1rem"
          ></el-pagination>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { ref } from "vue";
import { ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElPagination } from "element-plus";
import BaseMenu from "../components/BaseMenu.vue";
import DashboardTable from "../components/DashboardTable.vue";
import axios from "../../../shared/axios.js";

export default {
  components: {
    ElContainer,
    ElAside,
    ElHeader,
    ElMain,
    ElFooter,
    BaseMenu,
    ElPagination,
    DashboardTable
  },
  setup() {
    const totalRows = ref(1);
    const currentPage = ref(1);
    const pageSize = ref(50);
    axios.get("/dashboard/table/count").then((response) => {
      totalRows.value = parseInt(response.data.count, 10);
    });

    return {
      totalRows,
      currentPage,
      pageSize
    };
  }
};
</script>
