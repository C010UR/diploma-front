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
        placeholder="+375 (33) 123-12-12"
        :disabled="disable.clientPhone"
        maxlength="19"
        clearable
        style="max-width: 23ch"
      ></el-input>
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
    <el-form-item label="Описание" prop="description">
      <el-input
        type="textarea"
        v-model="form.description"
        :disabled="disable.description"
        placeholder="В 9.15 сломался комьютер"
        autosize
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
import { ElMessage } from "element-plus";
import axios from "../axios.js";

export default {
  data() {
    return {
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
            min: 6,
            message: "Ф.И.О. должно содержать более 5 символов",
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
          this.resetForm();
          this.toggleAll();
        })
        .catch(() => {
          ElMessage.error(
            "Упс! Мы не смогли отправить заявку. Повторите попытку либо обратитесь к администратору"
          );
          this.toggleAll();
        });
    }
  },
  mounted() {
    axios
      .get("/request/defects")
      .then((data) => {
        this.defects.options = data.data.map((el) => ({ value: el, label: el }));
        this.defects.loading = false;
      })
      .catch(() => {
        this.defects.loading = false;
        ElMessage.error("Упс! Мы не смогли загрузить неисправности. Обратитесь к администратору");
      });
    axios
      .get("/request/cabinets")
      .then((data) => {
        console.log(data);
        this.cabinet.options = data.data;
        this.cabinet.loading = false;
      })
      .catch(() => {
        this.cabinet.loading = false;
        ElMessage.error("Упс! Мы не смогли загрузить кабинеты. Обратитесь к администратору");
      });
    axios
      .get("/request/urgency")
      .then((data) => {
        this.urgency.options = data.data;
        this.urgency.loading = false;
      })
      .catch(() => {
        this.urgency.loading = false;
        ElMessage.error("Упс! Мы не смогли загрузить срочности. Обратитесь к администратору");
      });
  }
};
</script>

<style scoped>
form {
  margin: 0;
  padding: 0;
}
</style>
