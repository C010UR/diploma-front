<template>
  <el-drawer
    v-model="reportDrawer"
    direction="rtl"
    lock-scroll
    title="Выберите поля для отчета"
    size="false"
  >
    <template #default>
      <el-row><el-switch v-model="reportForm.created_at" active-text="Создано в" /></el-row>
      <el-row><el-switch v-model="reportForm.defects" active-text="Неисправности" /></el-row>
      <el-row><el-switch v-model="reportForm.cabinet" active-text="Кабинет" /></el-row>
      <el-row><el-switch v-model="reportForm.done_at" active-text="Выполнено в" /></el-row>
      <el-row><el-switch v-model="reportForm.technician" active-text="Исполнитель" /></el-row>
      <el-row><el-switch v-model="reportForm.status" active-text="Cтатус" /></el-row>
      <el-row>
        <el-switch v-model="reportForm.performed_works" active-text="Проделанные работы" />
      </el-row>
      <el-row><el-switch v-model="reportForm.client" active-text="Ф.И.О. Заказчика" /></el-row>
      <el-row>
        <el-switch v-model="reportForm.client_phone" active-text="Телефон заказчика" />
      </el-row>
      <br />
      <el-button @click="reportDrawer = false">Отмена</el-button>
      <el-button type="primary" @click="getReport()">Создать</el-button>
    </template>
  </el-drawer>
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
          <h2>Заявки на ремонт</h2>
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
        <div v-if="filter" style="margin-top: 0.5rem">
          <el-row v-for="i in filterCount" :key="i">
            <dashboard-filter-form
              :id="i"
              @filter="handleFilter"
              @error="handleError"
            ></dashboard-filter-form>
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
        <dashboard-table :update="update"></dashboard-table>
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
            @click="toggleReportDrawer()"
          >
            Создать отчет
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import { UserFilled, Menu, RefreshRight } from "@element-plus/icons-vue";
import { notification, errorPopup } from "../../../shared/notifications.js";
import BaseMenu from "../components/BaseMenu.vue";
import DashboardFilterForm from "../components/DashboardFilterForm.vue";
import DashboardTable from "../components/DashboardTable.vue";
import axios from "../../../shared/axios.js";

export default {
  components: {
    BaseMenu,
    DashboardFilterForm,
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
          errorPopup("Упс! Не удалось загрузить страницы!");
        });
    };

    const reportDrawer = ref(false);
    const toggleReportDrawer = () => {
      reportDrawer.value = !reportDrawer.value;
    };
    const reportForm = ref({
      created_at: true,
      defects: true,
      cabinet: true,
      done_at: true,
      technician: true,
      status: true,
      performed_works: true,
      client: true,
      client_phone: true
    });
    const getReport = () => {
      if (Object.keys(reportForm.value).some((key) => reportForm.value[key])) {
        axios
          .get("/dashboard/report", {
            params: {
              filters: JSON.stringify(store.getters.optionsAndFilters),
              columns: JSON.stringify(reportForm.value)
            },
            responseType: "blob"
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Report.xlsx");
            document.body.appendChild(link);
            link.click();
          })
          .catch(() => {
            errorPopup("Упс! Не удалось загрузить отчет!");
          });
      } else {
        errorPopup("Пожалуйста, укажите хотя бы одно поле");
      }
    };

    const update = ref(false);
    const toggleUpdate = () => {
      getPages();
      update.value = !update.value;
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
        getPages();
      }
      filterCount.value = 1;
    });

    const logout = () => {
      axios.post("/dashboard/auth/logout").then(() => {
        router.push("/dashboard/login");
      });
    };

    const handleFilter = (filterParam) => {
      if (filterParam.delete) {
        store.dispatch("removeFilters", { id: filterParam.id });
        filterCount.value = filterParam.id;
      } else {
        store.dispatch("addFilters", filterParam);
        filterCount.value =
          filterCount.value > filterParam.id + 1 || filterParam.id > 7
            ? filterCount.value
            : filterParam.id + 1;
      }
      getPages();
    };

    const handleError = () => {
      errorPopup("Упс! Что-то пошло не так");
    };

    const socket = io(
      process.env.NODE_ENV === "production"
        ? "https://mtec-support.herokuapp.com/"
        : "http://localhost:3000",
      {
        transports: ["websocket"]
      }
    );
    socket.on("row:new", () => {
      store.dispatch("setUpdated");
      getPages();
      notification("Новая заявка", "Появилась новая заявка!");
    });

    onBeforeUnmount(() => {
      socket.disconnect();
    });

    onMounted(() => {
      getPages();
    });

    return {
      filter,
      filterCount,
      drawer,
      toggleDrawer,
      reportDrawer,
      toggleReportDrawer,
      reportForm,
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
