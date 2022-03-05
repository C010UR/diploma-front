<template>
  <h2>{{ label }}</h2>
  <div style="height: 70vh; margin-bottom: 1rem">
    <el-table
      :data="tableData"
      :row-key="tableData.value"
      stripe
      empty-text="Данные отсутствуют"
      style="width: 100%; padding: 0"
      height="100%"
      border
    >
      <el-table-column label="Значение" prop="label">
        <template #default="scope">
          <el-input
            v-if="scope.row.edit"
            v-model="tableData[scope.$index].editValue"
            style="width: 50ch"
          ></el-input>
          <span v-else>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isUrgency" label="Интервал" prop="interval">
        <template #default="scope">
          <el-input
            v-if="scope.row.edit"
            v-model="tableData[scope.$index].editInterval"
            style="width: 50ch"
          ></el-input>
          <span v-else>{{ scope.row.interval }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Операции" :width="isAdministrator ? 100 : 180">
        <template #default="scope">
          <el-button
            v-if="!isAdministrator && !scope.row.edit"
            type="text"
            @click="toggleEdit(scope.$index)"
          >
            Изменить
          </el-button>
          <el-popconfirm
            v-if="!scope.row.edit"
            confirm-button-text="Да"
            cancel-button-text="Нет"
            title="Вы уверены, что хотите удалить это поле?"
            @confirm="deleteRow(scope.$index)"
          >
            <template #reference>
              <el-button type="text">Удалить</el-button>
            </template>
          </el-popconfirm>
          <el-button v-if="scope.row.edit" type="text" @click="editRow(scope.$index)">
            Сохранить
          </el-button>
          <el-button v-if="scope.row.edit" type="text" @click="toggleEdit(scope.$index)">
            Отменить
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-form inline v-if="!isAdministrator" :model="addForm" ref="formRef" :rules="rules">
    <el-form-item label="Значение" prop="value">
      <el-input v-model="addForm.value" style="width: 50ch"></el-input>
    </el-form-item>
    <el-form-item v-if="isUrgency" label="Интервал" prop="interval">
      <el-input v-model="addForm.interval" style="width: 50ch"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="addRow()" type="primary">Сохранить</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { h, ref, reactive, onMounted } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElPopconfirm,
  ElNotification
} from "element-plus";
import axios from "../../../shared/axios.js";

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElPopconfirm
  },
  props: {
    isUrgency: {
      type: Boolean,
      required: false,
      default: false
    },
    isAdministrator: {
      type: Boolean,
      required: false,
      default: false
    },
    table: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const tableData = ref([]);

    const handleError = () => {
      ElNotification({
        title: "Ошибка",
        message: h("i", { style: "color: teal" }, `Ошибка в таблице ${props.label}`),
        type: "error"
      });
    };

    const getTableData = () => {
      axios
        .get(`/dashboard/control/${props.table}`)
        .then((response) => {
          tableData.value = response.data;
        })
        .catch(() => {
          handleError();
        });
    };

    const deleteRow = (index) => {
      axios
        .delete(`/dashboard/control/${props.table}`, { data: { id: tableData.value[index].value } })
        .then(() => {
          getTableData();
          ElNotification({
            title: "Успешно удалено",
            message: h("i", { style: "color: teal" }, `Удалено в таблице ${props.label}`),
            type: "success"
          });
        })
        .catch(() => {
          handleError();
        });
    };

    const toggleEdit = (index) => {
      tableData.value[index].edit = !tableData.value[index].edit;
      tableData.value[index].editValue = tableData.value[index].label;
      tableData.value[index].editInterval = tableData.value[index].interval;
    };

    const editRow = (index) => {
      const data = {
        id: tableData.value[index].value,
        field: tableData.value[index].editValue
      };
      if (props.isUrgency) {
        data.interval = tableData.value[index].editInterval;
      }
      axios
        .patch(`/dashboard/control/${props.table}`, data)
        .then(() => {
          getTableData();
          ElNotification({
            title: "Успешно изменено",
            message: h("i", { style: "color: teal" }, `Заменено в таблице ${props.label}`),
            type: "success"
          });
        })
        .catch(() => {
          handleError();
        });
    };

    const formRef = ref(null);
    const addForm = reactive({
      value: null,
      interval: null
    });

    const rules = {
      value: [
        {
          required: true,
          message: "Пожалуйста, укажите значение",
          trigger: "blur"
        }
      ],
      interval: [
        {
          required: true,
          message: "Пожалуйста, укажите интервал",
          trigger: "blur"
        }
      ]
    };

    const addRow = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          const data = props.isUrgency
            ? { field: addForm.value, interval: addForm.interval }
            : { field: addForm.value };
          axios
            .post(`/dashboard/control/${props.table}`, data)
            .then(() => {
              getTableData();
              ElNotification({
                title: "Успешно добавлено",
                message: h("i", { style: "color: teal" }, `Добавлено в таблицу ${props.label}`),
                type: "success"
              });
            })
            .catch(() => {
              handleError();
            });
          return true;
        }
        return false;
      });
    };

    onMounted(() => {
      getTableData();
    });

    return {
      tableData,
      deleteRow,
      toggleEdit,
      editRow,
      formRef,
      addForm,
      rules,
      addRow
    };
  }
};
</script>
