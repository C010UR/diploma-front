<template>
  <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
    <el-form-item label="Ф.И.О." prop="clientName">
      <el-input
        v-model="form.clientName"
        placeholder="Иванов Иван Иванович"
        :disabled="disable.clientName"
        maxlength="128"
        show-word-limit
        clearable
        style="max-width: 132ch"
      ></el-input>
    </el-form-item>
    <el-form-item label="Телефон" prop="clientPhone">
      <el-input
        v-model="form.clientPhone"
        placeholder="(33) 123-12-12"
        :disabled="disable.clientPhone"
        maxlength="14"
        style="max-width: 32ch"
        @input="formatPhone()"
      >
        <template #prepend>+375</template>
      </el-input>
    </el-form-item>
    <el-form-item label="Кабинет" prop="cabinet">
      <el-select
        v-model="form.cabinet"
        placeholder="Пожалуйста, выберите кабинет"
        :loading="cabinet.loading"
        :disabled="disable.cabinet"
        loading-text="Загрузка"
        no-data-text="Упс! Что-то пошло не так!"
        style="width: 100%; max-width: 132ch"
      >
        <el-option
          v-for="item in cabinet.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Срочность" prop="urgency">
      <el-select
        v-model="form.urgency"
        placeholder="Пожалуйста, выберите срочность"
        :loading="urgency.loading"
        :disabled="disable.urgency"
        loading-text="Загрузка"
        no-data-text="Упс! Что-то пошло не так!"
        style="width: 100%; max-width: 132ch"
      >
        <el-option
          v-for="item in urgency.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Неисправности" prop="defects">
      <el-select-v2
        v-model="form.defects"
        placeholder="Пожалуйста, выберите неисправности"
        :options="defects.options"
        :loading="defects.loading"
        :disabled="disable.defects"
        multiple
        allow-create
        filterable
        clearable
        loading-text="Загрузка"
        no-data-text="Упс! Что-то пошло не так!"
        style="width: 100%; max-width: 132ch"
      />
    </el-form-item>
    <el-form-item label="Подробности неисправностей" prop="description">
      <el-input
        type="textarea"
        v-model="form.description"
        placeholder="В 9.15 сломался комьютер"
        :disabled="disable.description"
        :autosize="{ minRows: 3 }"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <div style="margin-left: auto; margin-right: 0">
        <el-button @click="resetForm()">Очистить</el-button>
        <el-button type="primary" :loading="disable.submit" @click="submitForm()">
          Отправить
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElSelectV2,
  ElOption,
  ElButton
} from "element-plus";
import axios from "../../../shared/axios.js";

export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElSelectV2,
    ElOption,
    ElButton
  },
  data() {
    return {
      socket: null,
      cabinet: {
        options: [],
        loading: true
      },
      urgency: {
        options: [],
        loading: true
      },
      defects: {
        options: [],
        loading: true
      },
      disable: {
        clientName: false,
        clientPhone: false,
        cabinet: false,
        urgency: false,
        defects: false,
        description: false,
        submit: false
      },
      form: {
        clientName: "",
        clientPhone: "",
        cabinet: "",
        urgency: "",
        defects: [],
        description: ""
      },
      rules: {
        clientName: [
          {
            required: true,
            message: "Пожалуйста, введите ваше Ф.И.О.",
            trigger: "blur"
          },
          {
            min: 5,
            message: "Ф.И.О. должно содержать более 4 символов",
            trigger: "blur"
          }
        ],
        clientPhone: [
          {
            pattern: /\(\d{2}\) \d{3}-\d{2}-\d{2}/,
            message: "Телефон должен быть действительным",
            trigger: "blur"
          }
        ],
        cabinet: [
          {
            required: true,
            message: "Пожалуйста, укажите кабинет",
            trigger: "change"
          }
        ],
        urgency: [
          {
            required: true,
            message: "Пожалуйста, укажите срочность",
            trigger: "change"
          }
        ],
        defects: [
          {
            required: true,
            message: "Пожалуйста, укажите неисправности",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.toggleAll();
          this.sendData();
          return true;
        }
        return false;
      });
    },
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    formatPhone() {
      const val = this.form.clientPhone
        .replace(/\D/g, "")
        .match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
      this.form.clientPhone = !val[2]
        ? val[1]
        : `(${val[1]}) ${val[2]}${val[3] ? `-${val[3]}` : ""}${val[4] ? `-${val[4]}` : ""}`;
    },
    toggleAll() {
      Object.keys(this.disable).forEach((key) => {
        this.disable[key] = !this.disable[key];
      });
    },
    sendData() {
      const data = {
        client_name: this.form.clientName,
        client_phone: this.form.clientPhone,
        urgency: this.form.urgency,
        cabinet: this.form.cabinet,
        defects: this.form.defects.sort().join("; "),
        defect_description: this.form.description
      };
      axios
        .post("/request", data)
        .then(() => {
          ElMessage({
            message: "Успешно отправлено",
            type: "success"
          });
          this.setLocalStorate();
          this.resetForm();
          this.getLocalStorage();
          this.toggleAll();
        })
        .catch(() => {
          ElMessage.error(
            "Упс! Мы не смогли отправить заявку. Повторите попытку позже либо обратитесь к администратору"
          );
          this.toggleAll();
        });
    },
    getLocalStorage() {
      this.form.clientName = localStorage.getItem("request-client-name");
      this.form.clientPhone = localStorage.getItem("request-client-phone");
      this.form.urgency = localStorage.getItem("request-urgency");
      this.form.cabinet = localStorage.getItem("request-client-cabinet");
    },
    setLocalStorate() {
      localStorage.setItem("request-client-name", this.form.clientName);
      localStorage.setItem("request-client-phone", this.form.clientPhone);
      localStorage.setItem("request-urgency", this.form.urgency);
      localStorage.setItem("request-client-cabinet", this.form.cabinet);
    },
    getDefects() {
      return axios.get("/request/defects").then((response) => {
        this.defects.options = response.data.map((el) => ({ value: el, label: el }));
        this.defects.loading = false;
        return true;
      });
    },
    getCabinets() {
      return axios.get("/request/cabinets").then((response) => {
        this.cabinet.options = response.data;
        this.cabinet.loading = false;
        return true;
      });
    },
    getUrgencies() {
      return axios.get("/request/urgency").then((response) => {
        this.urgency.options = response.data;
        this.urgency.loading = false;
        return true;
      });
    }
  },
  mounted() {
    Promise.all([this.getCabinets(), this.getDefects(), this.getUrgencies()])
      .then(() => {
        this.getLocalStorage();
        this.toggleAll();
      })
      .catch(() => {
        ElMessage.error(
          "Упс! Мы не смогли загрузить данные. Пожалуйста, обратитесь к администратору."
        );
      });
  },
  beforeMount() {
    this.toggleAll();
  }
};
</script>
