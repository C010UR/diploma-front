<template>
  <el-form
    ref="formRef"
    class="form"
    label-position="top"
    :model="form"
    :rules="rules"
    inline
    style="margin-left: 2rem"
  >
    <el-form-item label="Мастер" prop="technician_id">
      <el-select
        v-model="form.technician_id"
        placeholder="Пожалуйста, выберите мастера"
        no-data-text="Упс! Что-то пошло не так!"
        style="min-width: 35ch"
      >
        <el-option
          v-for="item in masters"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Проделанные работы" prop="performed_works">
      <el-select
        v-model="form.performed_works"
        placeholder="Пожалуйста, выберите проделанные работы"
        multiple
        allow-create
        filterable
        clearable
        no-data-text="Упс! Что-то пошло не так!"
        style="min-width: 80ch"
      >
        <el-option
          v-for="item in commonPerformedWorks"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="ㅤ">
      <el-button type="primary" @click="submitForm()">Сохранить</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ElForm, ElFormItem, ElSelect, ElOption, ElButton } from "element-plus";
import axios from "../../../shared/axios.js";

export default {
  components: {
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElButton
  },
  props: {
    prop: {
      type: Object,
      required: true
    },
    commonPerformedWorks: {
      type: Array,
      required: true
    },
    masters: {
      type: Array,
      required: true
    }
  },
  emits: ["submit:error", "submit:success"],
  data() {
    return {
      form: {
        id: this.prop.row._id,
        technician_id: this.prop.row.technician_id,
        performed_works: this.prop.row.performed_works
      },
      rules: {
        technician_id: [
          {
            required: true,
            message: "Пожалуйста, укажите мастера",
            trigger: "blur"
          }
        ],
        performed_works: [
          {
            required: true,
            message: "Пожалуйста, укажите проделанные работы",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    sendData() {
      axios
        .patch("/dashboard/table", this.form)
        .then(() => {
          this.$emit("submit:success", this._id);
        })
        .catch(() => {
          this.$emit("submit:error");
        });
    },
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.sendData();
          return true;
        }
        return false;
      });
    }
  }
};
</script>
