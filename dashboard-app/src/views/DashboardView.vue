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
            style="margin-right: 1rem; margin-top: 0.9rem"
          >
            Меню
          </el-button>
          <h2>Заявки на неисправности</h2>
          <el-button
            size="large"
            :icon="RefreshRight"
            type="text"
            style="margin-left: 0.5rem; margin-top: 1rem"
            @click="toggleUpdate()"
          ></el-button>
        </el-row>
        <el-row>
          <h3 style="margin: 0; margin-right: 1rem">Фильтрация</h3>
          <el-switch style="margin-top: -0.25rem" v-model="filter" />
        </el-row>
        <div v-if="filter">
          <el-row v-for="i in filterCount" :key="i">
            <filter-form :id="i" @filter="handleFilter" @error="handleError"></filter-form>
          </el-row>
        </div>
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
        <dashboard-table @update="handleUpdate()" :update="update"></dashboard-table>
      </el-main>
      <el-footer height="4rem">
        <el-row style="margin-left: auto; margin-right: 0">
          <span style="color: #606266; margin-top: 1.5rem">
            Всего: {{ totalRows }} На странице:
          </span>
          <el-select v-model="pageSize" style="margin: 0 0.5rem; margin-top: 1.125rem; width: 8ch">
            <el-option
              v-for="item in [10, 20, 50, 100]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            background
            layout="prev, pager, next"
            :total="totalRows"
            style="margin-top: 1rem"
          ></el-pagination>
          <el-button
            type="primary"
            style="margin: 0 0.5rem; margin-top: 1.125rem"
            @click="getReport()"
          >
            Создать отчет
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { h, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElNotification } from "element-plus";
import { UserFilled, Menu, RefreshRight } from "@element-plus/icons-vue";
import BaseMenu from "../components/BaseMenu.vue";
import FilterForm from "../components/FilterForm.vue";
import DashboardTable from "../components/DashboardTable.vue";
import axios from "../../../shared/axios.js";

export default {
  components: {
    BaseMenu,
    FilterForm,
    DashboardTable
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const filter = ref(false);
    const filterCount = ref(1);
    const totalRows = ref(1);
    const currentPage = ref(1);
    const pageSize = ref(50);

    const drawer = ref(false);
    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };
    const getPages = () => {
      axios
        .post("/dashboard/table/count", store.getters.filters)
        .then((response) => {
          totalRows.value = parseInt(response.data.count, 10);
        })
        .catch(() => {
          ElMessage.error("Упс! Не удалось загрузить страницы!");
        });
    };

    const getReport = () => {
      axios
        .get("/dashboard/report", {
          params: {
            filters: JSON.stringify(store.getters.optionsAndFilters)
          },
          responseType: "blob"
        })
        .then((response) => {
          console.log(response.data);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Report.xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          ElMessage.error("Упс! Не удалось загрузить отчет!");
        });
    };

    const update = ref(false);
    const toggleUpdate = () => {
      getPages();
      update.value = !update.value;
    };

    const handleUpdate = () => {
      getPages();
      ElNotification({
        title: "Новая заявка",
        message: h("i", { style: "color: teal" }, "Появилась новая заявка!")
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
        for (let i = 1; i <= filterCount.value; i++) {
          store.dispatch("removeFilters", i);
        }
      }
      filterCount.value = 1;
    });

    const logout = () => {
      axios.post("/dashboard/auth/logout").then(() => {
        router.push("/dashboard/login");
      });
    };

    onMounted(() => {
      getPages();
    });

    const handleFilter = (filterParam) => {
      if (filterParam.delete) {
        store.dispatch("removeFilters", { id: filterParam.id });
        filterCount.value = filterParam.id;
      } else {
        store.dispatch("addFilters", filterParam);
        filterCount.value = filterCount.value === 8 ? 8 : filterParam.id + 1;
      }
      getPages();
    };

    const handleError = () => {
      ElMessage.error("Упс! Что-то пошло не так");
    };

    return {
      filter,
      filterCount,
      drawer,
      toggleDrawer,
      handleUpdate,
      getReport,
      update,
      toggleUpdate,
      totalRows,
      currentPage,
      pageSize,
      logout,
      handleFilter,
      handleError,
      UserFilled,
      Menu,
      RefreshRight
    };
  }
};
</script>
