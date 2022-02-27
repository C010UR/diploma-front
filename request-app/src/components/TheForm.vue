<template>
  <el-form class="form" label-position="top" :model="form" :rules="rules" show-message>
    <el-form-item label="Ф.И.О." prop="clientName">
      <el-input
        v-model="form.clientName"
        placeholder="Иванов Иван Иванович"
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
        maxlength="128"
        clearable
        style="max-width: 23ch"
      ></el-input>
    </el-form-item>
    <el-form-item label="Кабинет" prop="cabinet">
      <el-select
        v-model="form.cabinet"
        placeholder="Пожалуйста, выберите кабинет"
        :loading="cabinetLoading"
        :disabled="cabinetDisable"
        loading-text="Загрузка"
        no-data-text="Упс. Что-то пошло не так!"
        style="width: 100%; max-width: 132ch"
      >
        <el-option
          v-for="item in cabinetOptions"
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
        :loading="urgencyLoading"
        :disabled="urgencyDisable"
        loading-text="Загрузка"
        no-data-text="Упс. Что-то пошло не так!"
        style="width: 100%; max-width: 132ch"
      >
        <el-option
          v-for="item in urgencyOptions"
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
        :options="defectOptions"
        :loading="defectLoading"
        :disabled="defectDisable"
        multiple
        allow-create
        filterable
        clearable
        loading-text="Загрузка"
        no-data-text="Упс. Что-то пошло не так!"
        style="width: 100%; max-width: 132ch"
      />
    </el-form-item>
    <el-form-item label="Описание" prop="description">
      <el-input
        type="textarea"
        v-model="form.description"
        placeholder="В 9.15 сломался комьютер"
        autosize
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="margin-left: auto; margin-right: 0">
        Отправить
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      cabinetOptions: [
        {
          label: "1",
          value: "1"
        },
        {
          label: "1",
          value: "1"
        },
        {
          label: "1",
          value: "1"
        },
        {
          label: "1",
          value: "1"
        }
      ],
      cabinetLoading: false,
      cabinetDisable: false,
      urgencyOptions: [
        {
          label: "2",
          value: "1"
        },
        {
          label: "2",
          value: "1"
        },
        {
          label: "2",
          value: "1"
        },
        {
          label: "2",
          value: "1"
        }
      ],
      urgencyLoading: false,
      urgencyDisable: false,
      defectOptions: [
        {
          label: "1",
          value: "1"
        },
        {
          label: "2",
          value: "2"
        },
        {
          label: "3",
          value: "3"
        }
      ],
      defectLoading: false,
      defectDisable: false,
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
            message: "Ф.И.О. должно содержать более 6 символов",
            trigger: "blur"
          }
        ],
        cabinet: [
          {
            required: true,
            message: "Пожалуйста, укажите кабинет"
          }
        ]
      }
    };
  }
};
</script>

<style scoped>
form {
  margin: 0;
  padding: 0;
}
</style>
