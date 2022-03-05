<template>
  <el-drawer
    :model-value="modelValue"
    title="Меню"
    lock-scroll
    direction="ltr"
    :size="size"
    @closed="$emit('update:modelValue', false)"
  >
    <el-menu
      default-active="1"
      style="margin-left: -1.25rem; margin-right: -1.25rem"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <el-icon><message-box /></el-icon>
        <span>Заявки</span>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><icon-menu /></el-icon>
          <span>Администрирование</span>
        </template>
        <el-menu-item index="1-1">Мастера</el-menu-item>
        <el-menu-item index="1-2">Частые проведенные работы</el-menu-item>
        <el-menu-item index="1-3">Частые неисправности</el-menu-item>
        <el-menu-item index="1-4">Кабинеты</el-menu-item>
        <el-menu-item index="1-5">Срочности</el-menu-item>
        <el-menu-item index="1-6">Администраторы</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-drawer>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMenu, ElSubMenu, ElMenuItem, ElIcon, ElDrawer } from "element-plus";
import { MessageBox, Menu as IconMenu } from "@element-plus/icons-vue";

export default {
  components: {
    ElMenu,
    ElSubMenu,
    ElMenuItem,
    ElIcon,
    MessageBox,
    IconMenu,
    ElDrawer
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const router = useRouter();
    const handleSelect = (key) => {
      switch (key) {
        case "1-1":
          router.push("/controls#masters");
          break;
        case "1-2":
          router.push("/controls#common_works");
          break;
        case "1-3":
          router.push("/controls#common_defects");
          break;
        case "1-4":
          router.push("/controls#cabinets");
          break;
        case "1-5":
          router.push("/controls#urgency");
          break;
        case "1-6":
          router.push("/controls#administrators");
          break;
        case "1":
        default:
          router.push("/");
      }
    };

    const size = ref("20%");

    const handleSize = () => {
      if (window.innerWidth <= 600) {
        size.value = "100%";
      } else if (window.innerWidth <= 850) {
        size.value = "40%";
      } else if (window.innerWidth <= 1100) {
        size.value = "30%";
      } else {
        size.value = "20%";
      }
    };

    onMounted(() => {
      window.addEventListener("resize", handleSize);
      handleSize();
    });

    return { handleSelect, size };
  }
};
</script>
