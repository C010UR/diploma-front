<template>
  <el-scrollbar>
    <el-menu default-active="1" style="min-height: 100vh" @select="handleSelect">
      <el-menu-item index="1">
        <el-icon><message-box /></el-icon>
        <span>Заявки</span>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><tools /></el-icon>
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
  </el-scrollbar>
</template>

<script>
import { ElScrollbar, ElMenu, ElSubMenu, ElMenuItem, ElIcon } from "element-plus";
import { MessageBox, Tools } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

export default {
  components: {
    ElScrollbar,
    ElMenu,
    ElSubMenu,
    ElMenuItem,
    ElIcon,
    MessageBox,
    Tools
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
    return { handleSelect };
  }
};
</script>
