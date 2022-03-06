<template>
  <el-table
    :data="tableData"
    :row-key="(row) => row._id"
    style="width: 100%; padding: 0"
    stripe
    empty-text="Данные отсутствуют"
    height="100%"
    @sort-change="changeSorting"
  >
    <el-table-column type="expand">
      <template #default="props">
        <div v-if="props.row.defect_description" style="margin-left: 2rem">
          <h4>Подробности Неисправности:</h4>
          <div style="margin-right: 2rem">
            <p>{{ props.row.defect_description }}</p>
          </div>
        </div>
        <dashboard-table-row
          :prop="props"
          :masters="masters"
          :commonPerformedWorks="commonPerformedWorks"
          @submit:error="submitError()"
          @submit:success="submitSuccess()"
          style="margin-left: 2rem"
        ></dashboard-table-row>
      </template>
    </el-table-column>
    <el-table-column label="Создано в" prop="created_at" width="145" sortable="custom" />
    <el-table-column label="Выполнено в" prop="done_at" width="145" />
    <el-table-column label="Статус" prop="status" align="center" width="130" sortable="custom">
      <template #default="scope">
        <el-tag effect="dark" :type="getStatusType(scope.row.status)">
          {{ getStatus(scope.row.status) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Кабинет" prop="cabinet" width="180" />
    <el-table-column label="Ф.И.О. заказчика" prop="client" width="260" />
    <el-table-column label="Телефон" prop="client_phone" width="120" />
    <el-table-column label="Неисправности" prop="defects" min-width="300" />
  </el-table>
</template>

<script>
import { h, ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElNotification } from "element-plus";
import { io } from "socket.io-client";
import DashboardTableRow from "./DashboardTableForm.vue";
import axios from "../../../shared/axios.js";

export default {
  components: {
    DashboardTableRow
  },
  emits: ["update"],
  props: {
    update: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const tableOptions = computed(() => store.getters.optionsAndFilters);

    const masters = ref([]);
    const commonPerformedWorks = ref([]);
    const tableData = ref([]);

    const getStatusType = (status) => {
      switch (status) {
        case "0:completed":
          return "success";
        case "1:expired":
          return "danger";
        case "2:hour":
          return "warning";
        case "3:day":
          return "";
        case "4:week":
        case "5:none":
          return "info";
        default:
          return "info";
      }
    };
    const getStatus = (status) => {
      switch (status) {
        case "0:completed":
          return "Выполнено";
        case "1:expired":
          return "Просрочено";
        case "2:hour":
          return "< Часа";
        case "3:day":
          return "< Дня";
        case "4:week":
          return "< недели";
        case "5:none":
          return "> недели";
        default:
          return "Неизвестно";
      }
    };

    const padStr = (i) => {
      return i < 10 ? `0${i}` : `${i}`;
    };
    const dateToStr = (date) => {
      // prettier-ignore
      return `${padStr(date.getFullYear())}-${padStr(date.getMonth() + 1)}-${padStr(date.getDate())} ${padStr(date.getHours())}:${padStr(date.getMinutes())}`;
    };
    const mapTableData = () => {
      for (let i = 0; i < tableData.value.length; i++) {
        tableData.value[i].created_at = dateToStr(new Date(tableData.value[i].created_at));
        if (tableData.value[i].done_at) {
          tableData.value[i].done_at = dateToStr(new Date(tableData.value[i].done_at));
        }
      }
    };
    const getTableData = () => {
      axios
        .post("/dashboard/table", tableOptions.value)
        .then((response) => {
          tableData.value = response.data;
          mapTableData();
        })
        .catch(() => {
          ElMessage.error("Упс! Не удалось загрузить данные!");
        });
    };
    watch(tableOptions, () => {
      getTableData();
    });

    const getMasters = () => {
      axios
        .get("/dashboard/control/technicians")
        .then((response) => {
          masters.value = response.data;
        })
        .catch(() => {
          ElMessage.error("Упс! Не удалось загрузить данные!");
        });
    };

    const getCommonPerformedWorks = () => {
      axios
        .get("/dashboard/control/works")
        .then((response) => {
          commonPerformedWorks.value = response.data;
        })
        .catch(() => {
          ElMessage.error("Упс! Не удалось загрузить данные!");
        });
    };

    const submitSuccess = () => {
      ElMessage.success("Успешно сохранено");
      getTableData();
    };
    const submitError = () => {
      ElMessage.error("Упс! Не удалось сохранить данные");
    };

    const changeSorting = ({ prop, order }) => {
      store.dispatch("setOptions", {
        orderBy: prop,
        orderDirection: order
      });
    };

    watch(
      () => props.update,
      () => getTableData()
    );

    const socket = io("http://localhost:3000", {
      transports: ["websocket"]
    });
    socket.on("row:new", () => {
      getTableData();
      ElNotification({
        title: "Новая заявка",
        message: h("i", { style: "color: teal" }, "Появилась новая заявка!")
      });
      emit("update");
    });
    onMounted(() => {
      getTableData();
      getMasters();
      getCommonPerformedWorks();
    });
    return {
      tableData,
      masters,
      commonPerformedWorks,
      getStatusType,
      getStatus,
      submitSuccess,
      submitError,
      changeSorting
    };
  }
};
</script>
