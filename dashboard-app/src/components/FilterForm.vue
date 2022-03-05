<template>
  <el-form inline ref="formRef" :model="form">
    <el-form-item label="По">
      <el-select
        v-model="form.column"
        placeholder="Статус"
        no-data-text="Упс! Что-то пошло не так!"
      >
        <el-option
          v-for="item in columns"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Оператор" v-if="valueInput !== 'selectTechnician'">
      <el-select
        v-model="form.operator"
        :placeholder="form.operatorColumns[0].label"
        no-data-text="Упс!"
        style="width: 14ch"
      >
        <el-option
          v-for="item in form.operatorColumns"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Значение" v-if="valueInput === 'selectTechnician'">
      <el-select
        v-model="form.value"
        placeholder="Петров Петр"
        no-data-text="Упс! Что-то пошло не так!"
      >
        <el-option
          v-for="item in technicianOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-else-if="valueInput === 'inputDate'" label="Значение">
      <el-date-picker
        v-model="form.value"
        type="date"
        placeholder="Выберите день"
        :shortcuts="dateInputShortcuts"
      ></el-date-picker>
    </el-form-item>
    <el-form-item v-else-if="valueInput === 'betweenDate'" label="Значение">
      <el-date-picker
        v-model="form.value"
        type="daterange"
        unlink-panels
        range-separator="до"
        start-placeholder="Выберите начало"
        end-placeholder="Выберите конец"
        :shortcuts="dateRangeShortcuts"
      ></el-date-picker>
    </el-form-item>
    <el-form-item v-else-if="valueInput === 'inputStatus'" label="Значение">
      <el-select
        v-model="form.value"
        :placeholder="statusOptions[0].label"
        no-data-text="Упс! Что-то пошло не так!"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-else-if="valueInput === 'betweenStatus'" label="Значение">
      <el-select
        v-model="form.value"
        :placeholder="statusOptions[0].label"
        no-data-text="Упс! Что-то пошло не так!"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin: 0 0.5rem">-</span>
      <el-select
        v-model="form.value2"
        :placeholder="statusOptions[1].label"
        no-data-text="Упс! Что-то пошло не так!"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-else-if="valueInput === 'between'" label="Значения">
      <el-input
        v-model="form.value"
        placeholder="Пожалуйста, введите значение"
        clearable
        style="width: 35ch"
      ></el-input>
      <span style="margin: 0 0.5rem">-</span>
      <el-input
        v-model="form.value2"
        placeholder="Пожалуйста, введите значение"
        clearable
        style="width: 35ch"
      ></el-input>
    </el-form-item>
    <el-form-item v-else-if="valueInput === 'input'" label="Значение">
      <el-input
        v-model="form.value"
        placeholder="Пожалуйста, введите значение"
        clearable
        style="width: 60ch"
      ></el-input>
    </el-form-item>
    <el-form-item v-else-if="valueInput === 'containsWorks'" label="Значения">
      <el-select-v2
        v-model="form.value"
        placeholder="Пожалуйста, выберите значения"
        :options="containsOptions"
        multiple
        allow-create
        filterable
        clearable
        no-data-text="Упс! Что-то пошло не так!"
        style="width: 60ch"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()">Очистить</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, reactive, watch } from "vue";
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElSelectV2,
  ElInput,
  ElOption,
  ElButton,
  ElDatePicker
} from "element-plus";
import axios from "../../../shared/axios.js";

export default {
  components: {
    ElForm,
    ElFormItem,
    ElSelect,
    ElSelectV2,
    ElInput,
    ElOption,
    ElButton,
    ElDatePicker
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  emits: ["filter", "error"],
  setup(props, { emit }) {
    const formRef = ref(null);
    const columns = [
      {
        label: "Создано в",
        value: "created_at"
      },
      {
        label: "Выполнено в",
        value: "done_at"
      },
      {
        label: "Статус",
        value: "status"
      },
      {
        label: "Кабинет",
        value: "cabinet"
      },
      {
        label: "Ф.И.О. заказчика",
        value: "client"
      },
      {
        label: "Неисправности",
        value: "defects"
      },
      {
        label: "Мастер",
        value: "technician_id"
      },
      {
        label: "Проделанные работы",
        value: "performed_works"
      }
    ];
    const operators = {
      equals: {
        label: "=",
        value: "="
      },
      greater: {
        label: ">",
        value: ">"
      },
      greaterEquals: {
        label: ">=",
        value: ">="
      },
      lower: {
        label: "<",
        value: "<"
      },
      lowerEquals: {
        label: "<=",
        value: "<="
      },
      between: {
        label: "Между",
        value: "between"
      },
      contains: {
        label: "Содержит",
        value: "contains"
      },
      like: {
        label: "Похож на",
        value: "like"
      }
    };
    const valueInput = ref("");
    const form = reactive({
      column: "created_at",
      operator: "",
      value: null,
      value2: null,
      operatorColumns: [
        operators.greater,
        operators.greaterEquals,
        operators.lower,
        operators.lowerEquals,
        operators.between
      ]
    });

    const dateInputShortcuts = [
      {
        text: "Сегодня",
        value: new Date()
      },
      {
        text: "Вчера",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        }
      },
      {
        text: "Неделю назад",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return date;
        }
      }
    ];

    const dateRangeShortcuts = [
      {
        text: "Последняя неделя",
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end];
        }
      },
      {
        text: "Последний месяц",
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return [start, end];
        }
      },
      {
        text: "Последние 3 месяца",
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          return [start, end];
        }
      },
      {
        text: "Последний год",
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
          return [start, end];
        }
      }
    ];

    const statusOptions = ref([
      {
        label: "Выполнено",
        value: "0:completed"
      },
      {
        label: "Просрочено",
        value: "1:expired"
      },
      {
        label: "< Часа",
        value: "2:hour"
      },
      {
        label: "< Дня",
        value: "3:day"
      },
      {
        label: "< недели",
        value: "4:week"
      },
      {
        label: "> недели",
        value: "5:none"
      }
    ]);

    const technicianOptions = ref([]);

    const getTechnicianOptions = () => {
      axios
        .get("/dashboard/control/technicians")
        .then((response) => {
          technicianOptions.value = response.data;
        })
        .catch(() => {
          emit("error");
        });
    };

    const containsOptions = ref([]);

    const getContainsOptions = (table) => {
      axios
        .get(`/dashboard/control/${table}`)
        .then((response) => {
          containsOptions.value = response.data;
        })
        .catch(() => {
          emit("error");
        });
    };

    const resetForm = () => {
      form.column = "created_at";
      form.operator = "";
      form.value = null;
      form.value2 = null;
    };

    watch(
      () => form.column,
      () => {
        switch (form.column) {
          case "performed_works":
            form.operatorColumns = [operators.equals, operators.contains];
            break;
          case "technician_id":
            form.operatorColumns = [];
            break;
          case "defects":
            form.operatorColumns = [operators.equals, operators.like];
            break;
          case "client":
            form.operatorColumns = [operators.equals, operators.like];
            break;
          case "cabinet":
            form.operatorColumns = [operators.equals, operators.between, operators.like];
            break;
          case "status":
            form.operatorColumns = [operators.equals, operators.between];
            break;
          case "done_at":
          default:
            form.operatorColumns = [
              operators.greater,
              operators.greaterEquals,
              operators.lower,
              operators.lowerEquals,
              operators.between
            ];
        }
      }
    );

    watch(
      () => form.column,
      () => {
        form.operator = "";
      }
    );

    watch(
      () => [form.column, form.operator],
      () => {
        form.value = null;
        if (form.column === "" && form.operator === "") {
          valueInput.value = "";
        } else if (form.column === "technician_id") {
          getTechnicianOptions();
          valueInput.value = "selectTechnician";
        } else if (form.column === "performed_works") {
          form.value = [];
          getContainsOptions("works");
          valueInput.value = "containsWorks";
        } else {
          switch (form.operator) {
            case "between":
              valueInput.value = "between";
              break;
            case "contains":
              valueInput.value = "contains";
              break;
            case "=":
            case ">":
            case ">=":
            case "<":
            case "<=":
            case "like":
              valueInput.value = "input";
              break;
            default:
              valueInput.value = "";
          }
          if (form.column === "created_at" || form.column === "done_at") {
            valueInput.value += "Date";
          }
          if (form.column === "status") {
            valueInput.value += "Status";
          }
        }
      }
    );

    watch(
      () => [form.value, form.value2],
      () => {
        if (
          (valueInput.value === "between" || valueInput.value === "betweenStatus") &&
          form.value2
        ) {
          emit("filter", {
            id: props.id,
            column: form.column,
            operator: form.operator,
            value: [form.value, form.value2]
          });
        } else if (!(valueInput.value === "between" || valueInput.value === "betweenStatus")) {
          emit("filter", {
            id: props.id,
            column: form.column,
            operator: form.operator,
            value: form.value
          });
        }
      }
    );

    return {
      form,
      formRef,
      columns,
      valueInput,
      dateInputShortcuts,
      dateRangeShortcuts,
      statusOptions,
      technicianOptions,
      containsOptions,
      resetForm
    };
  }
};
</script>
