<template>
  <base-form header="Регистрация">
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
      <el-form-item label="Повторите пароль" prop="passwordRepeat">
        <el-input
          v-model="form.passwordRepeat"
          :disabled="disable.passwordRepeat"
          maxlength="32"
          type="passwordRepeat"
          show-password
          style="max-width: 132ch"
        ></el-input>
      </el-form-item>
      <el-form-item label="Секретный ключ" prop="secret">
        <el-input
          v-model="form.secret"
          :disabled="disable.secret"
          type="password"
          show-password
          style="max-width: 132ch"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <router-link to="/dashboard/login" custom v-slot="{ navigate }">
          <el-button type="text" @click="navigate">Войти</el-button>
        </router-link>
        <div style="margin-left: auto; margin-right: 0">
          <el-button @click="resetForm()">Очистить</el-button>
          <el-button type="primary" :loading="disable.submit" @click="submitForm()">
            Зарегистрироваться
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </base-form>
</template>

<script>
import validator from "validator";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
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
      password: "",
      passwordRepeat: "",
      secret: ""
    });
    const disable = reactive({
      login: false,
      password: false,
      submit: false,
      passwordRepeat: false,
      secret: false
    });
    const toggleAll = () => {
      Object.keys(disable).forEach((key) => {
        disable[key] = !disable[key];
      });
    };
    const sendData = () => {
      axios
        .post("/dashboard/auth/register", {
          login: form.login,
          password: form.password,
          secret_key: form.secret
        })
        .then(() => {
          router.push("/dashboard/login");
        })
        .catch(() => {
          ElMessage.error("Логин уже существует либо секретный ключ неверен!");
          toggleAll();
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
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (form.passwordRepeat !== "") {
          if (!formRef.value) return;
          formRef.value.validateField("passwordRepeat", () => null);
        }
        if (!validator.isStrongPassword(form.password, { minSymbols: 0 })) {
          callback(new Error("Пароль недостаточно надежный"));
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (value !== form.password) {
        callback(new Error("Пароли не совпадают"));
      } else {
        callback();
      }
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
        },
        {
          validator: validatePass,
          trigger: "change"
        },
        {
          validator: validatePass,
          trigger: "blur"
        }
      ],
      passwordRepeat: [
        {
          required: true,
          message: "Пожалуйста, повторите пароль",
          trigger: "blur"
        },
        {
          validator: validatePass2,
          trigger: "blur"
        }
      ],
      secret: [
        {
          required: true,
          message: "Пожалуйста, укажите секретный ключ",
          trigger: "blur"
        }
      ]
    });
    return { formRef, form, rules, resetForm, submitForm, sendData, toggleAll, disable };
  }
};
</script>
