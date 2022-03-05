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
      :default-active="activeMenu"
      style="margin-left: -1.25rem; margin-right: -1.25rem"
      @select="handleSelect"
    >
      <el-menu-item index="/dashboard/">
        <el-icon><message-box /></el-icon>
        <span>Заявки</span>
      </el-menu-item>
      <el-sub-menu index="/dashboard/controls">
        <template #title>
          <el-icon><setting /></el-icon>
          <span>Администрирование</span>
        </template>
        <el-menu-item index="/dashboard/controls#masters">
          <el-icon><user /></el-icon>
          Мастера
        </el-menu-item>
        <el-menu-item index="/dashboard/controls#common_works">
          <el-icon><check /></el-icon>
          Проделанные работы
        </el-menu-item>
        <el-menu-item index="/dashboard/controls#common_defects">
          <el-icon><help /></el-icon>
          Неисправности
        </el-menu-item>
        <el-menu-item index="/dashboard/controls#cabinets">
          <el-icon><office-building /></el-icon>
          Кабинеты
        </el-menu-item>
        <el-menu-item index="/dashboard/controls#urgency">
          <el-icon><ic-view /></el-icon>
          Срочности
        </el-menu-item>
        <el-menu-item index="/dashboard/controls#administrators">
          <el-icon><service /></el-icon>
          Администраторы
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-drawer>
</template>

<script>
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMenu, ElSubMenu, ElMenuItem, ElIcon, ElDrawer } from "element-plus";
import {
  MessageBox,
  Setting,
  User,
  Service,
  View as IcView,
  Help,
  Check,
  OfficeBuilding
} from "@element-plus/icons-vue";

export default {
  components: {
    ElMenu,
    ElSubMenu,
    ElMenuItem,
    ElIcon,
    ElDrawer,
    MessageBox,
    Setting,
    User,
    Service,
    IcView,
    Help,
    Check,
    OfficeBuilding
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const router = useRouter();
    const activeMenu = ref("");

    const currentRoute = computed(
      () => router.currentRoute.value.path + router.currentRoute.value.hash
    );

    watch(currentRoute, () => {
      activeMenu.value = currentRoute.value;
    });

    const handleSelect = (key) => {
      router.push(key);
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
      activeMenu.value = router.currentRoute.value.fullPath;
    });

    return { handleSelect, size, activeMenu };
  }
};
</script>
