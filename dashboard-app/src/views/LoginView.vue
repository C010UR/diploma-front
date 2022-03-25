<template>
  <base-form header="Авторизация">
    <el-form ref="formRef" class="form" label-position="top" :model="form" :rules="rules">
      <el-form-item label="Логин" prop="login">
        <el-input
          v-model="form.login"
          :disabled="disable.login"
          maxlength="32"
          show-word-limit
          clearable
          style="max-width: 132ch"
        ></el-input>
      </el-form-item>
      <el-form-item label="Пароль" prop="password">
        <el-input
          v-model="form.password"
          :disabled="disable.password"
          maxlength="32"
          type="password"
          show-password
          style="max-width: 132ch"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <router-link to="/dashboard/register" custom v-slot="{ navigate }">
          <el-button type="text" @click="navigate">Зарегистрироваться</el-button>
        </router-link>
        <div style="margin-left: auto; margin-right: 0">
          <el-button @click="resetForm()">Очистить</el-button>
          <el-button type="primary" :loading="disable.submit" @click="submitForm()">
            Войти
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </base-form>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { errorPopup } from "../../../shared/notifications.js";
import BaseForm from "../../../shared/components/BaseForm.vue";
import axios from "../../../shared/axios.js";

export default {
  components: {
    BaseForm
  },
  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const form = reactive({
      login: "",
      password: ""
    });
    const disable = reactive({
      login: false,
      password: false,
      submit: false
    });
    const toggleAll = () => {
      Object.keys(disable).forEach((key) => {
        disable[key] = !disable[key];
      });
    };
    const sendData = () => {
      axios
        .post("/dashboard/auth/login", { login: form.login, password: form.password })
        .then(() => {
          router.push("/dashboard");
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            errorPopup("Логин либо пароль неверны!");
            toggleAll();
            return;
          }
          errorPopup("Упс! Что-то пошло не так!");
        });
    };
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          toggleAll();
          sendData();
          return true;
        }
        return false;
      });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    const rules = reactive({
      login: [
        {
          required: true,
          message: "Пожалуйста, укажите логин",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "Пожалуйста, укажите пароль",
          trigger: "blur"
        }
      ]
    });
    return { formRef, form, rules, resetForm, submitForm, sendData, toggleAll, disable };
  }
};
</script>
