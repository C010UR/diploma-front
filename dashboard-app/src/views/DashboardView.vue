<template>
  <el-container style="height: 100vh">
    <el-container style="background-color: white">
      <base-menu v-model="drawer"></base-menu>
      <el-header height="auto">
        <el-row>
          <el-button
            @click="toggleDrawer"
            type="text"
            :icon="Menu"
            size="large"
            style="margin-right: 1rem; margin-top: 0.625rem"
          >
            Меню
          </el-button>
          <h1>Заявки на неисправности</h1>
        </el-row>
        <el-row>
          <h1 style="margin: 0; margin-right: 1rem">Фильтрация</h1>
          <el-switch style="margin-top: -0.25rem" v-model="filter" />
        </el-row>
        <el-row v-if="filter">
          <filter-form id="1" @filter="handleFilter" @error="handleError"></filter-form>
        </el-row>
        <el-row v-if="filter">
          <filter-form id="2" @filter="handleFilter" @error="handleError"></filter-form>
        </el-row>
        <div style="position: absolute; right: 1rem; top: 1rem">
          <el-popconfirm
            confirm-button-text="Да"
            cancel-button-text="Нет"
            title="Вы уверены, что хотите выйти?"
            @confirm="logout"
          >
            <template #reference>
              <el-avatar :icon="UserFilled"></el-avatar>
            </template>
          </el-popconfirm>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <dashboard-table @update="getPages"></dashboard-table>
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
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElPagination,
  ElPopconfirm,
  ElAvatar,
  ElButton,
  ElSwitch,
  ElRow,
  ElMessage
} from "element-plus";
import { UserFilled, Menu } from "@element-plus/icons-vue";
import BaseMenu from "../components/BaseMenu.vue";
import FilterForm from "../components/FilterForm.vue";
import DashboardTable from "../components/DashboardTable.vue";
import axios from "../../../shared/axios.js";

export default {
  components: {
    ElContainer,
    ElHeader,
    ElMain,
    ElFooter,
    ElPagination,
    ElPopconfirm,
    ElAvatar,
    ElButton,
    ElSwitch,
    ElRow,
    BaseMenu,
    FilterForm,
    DashboardTable
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const filter = ref(false);
    const drawer = ref(false);
    const totalRows = ref(1);
    const currentPage = ref(1);
    const pageSize = ref(50);

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    const getPages = () => {
      axios
        .post("/dashboard/table/count", store.getters.filters)
        .then((response) => {
          totalRows.value = parseInt(response.data.count, 10);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    };

    watch([currentPage, pageSize], () => {
      store.dispatch("setOptions", {
        limit: pageSize.value,
        page: currentPage.value
      });
    });

    watch(filter, () => {
      if (!filter.value) {
        store.dispatch("removeFilters");
      }
    });

    const logout = () => {
      axios.post("/dashboard/auth/logout").then(() => {
        router.push("/login");
      });
    };

    onMounted(() => {
      getPages();
    });

    const handleFilter = (filterParam) => {
      store.dispatch("addFilters", filterParam);
      getPages();
    };

    const handleError = () => {
      ElMessage.error("Упс! Что-то пошло не так");
    };

    return {
      filter,
      drawer,
      toggleDrawer,
      totalRows,
      currentPage,
      pageSize,
      getPages,
      logout,
      UserFilled,
      Menu,
      handleFilter,
      handleError
    };
  }
};
</script>
