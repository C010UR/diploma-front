<template>
  <div>
    <h4>Проделанные работы:</h4>
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules" inline>
      <el-form-item label="Исполнитель" prop="technician_id">
        <el-select
          v-model="form.technician_id"
          placeholder="Пожалуйста, выберите исполнителя"
          no-data-text="Упс! Что-то пошло не так!"
          style="min-width: 42ch"
        >
          <el-option
            v-if="nilTechnician"
            label="[Удалено]"
            value="00000000-0000-0000-0000-000000000000"
            disabled
          ></el-option>
          <el-option
            v-for="item in technicians"
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
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ㅤ">
        <el-button type="primary" @click="submitForm()">Сохранить</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "../../../shared/axios.js";

export default {
  props: {
    prop: {
      type: Object,
      required: true
    },
    commonPerformedWorks: {
      type: Array,
      required: true
    },
    technicians: {
      type: Array,
      required: true
    }
  },
  emits: ["submit:error", "submit:success"],
  data() {
    return {
      nilTechnician: false,
      form: {
        id: this.prop.row._id,
        technician_id: this.prop.row.technician_id,
        performed_works: this.prop.row.performed_works
      },
      rules: {
        technician_id: [
          {
            required: true,
            message: "Пожалуйста, выберите исполнителя",
            trigger: "change"
          },
          {
            validator: this.validateTechnician,
            trigger: "change"
          }
        ],
        performed_works: [
          {
            required: true,
            message: "Пожалуйста, укажите проделанные работы",
            trigger: "blur"
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
    },
    validateTechnician(rule, value, callback) {
      if (value === "00000000-0000-0000-0000-000000000000") {
        callback(new Error("Пожалуйста, выберите исполнителя"));
      } else {
        callback();
      }
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    "form.technician_id": function (newVal) {
      if (newVal !== "00000000-0000-0000-0000-000000000000") {
        this.nilTechnician = false;
      }
    }
  },
  mounted() {
    if (this.form.technician_id === "00000000-0000-0000-0000-000000000000") {
      this.nilTechnician = true;
    }
  }
};
</script>
