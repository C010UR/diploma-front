<template>
  <el-container style="height: 100vh">
    <el-container style="background-color: white">
      <base-menu v-model="drawer"></base-menu>
      <el-header height="auto">
        <el-row>
          <el-button
            @click="toggleDrawer"
            type="text"
            :icon="Menu"
            size="large"
            style="margin-right: 1rem; margin-top: 0.9rem"
          >
            Меню
          </el-button>
          <h2>Администрирование</h2>
        </el-row>
        <el-divider></el-divider>
        <div style="position: absolute; right: 1rem; top: 1rem">
          <el-popconfirm
            confirm-button-text="Да"
            cancel-button-text="Нет"
            title="Вы уверены, что хотите выйти?"
            @confirm="logout"
          >
            <template #reference>
              <el-avatar :icon="UserFilled"></el-avatar>
            </template>
          </el-popconfirm>
        </div>
      </el-header>
      <el-main style="padding: 0 10rem">
        <div>
          <section class="section" id="masters" :ref="(el) => (refs.masters = el)">
            <controls-table table="technicians" label="Мастера"></controls-table>
            <el-divider class="divider"></el-divider>
          </section>
          <section class="section" id="common_works" :ref="(el) => (refs.common_works = el)">
            <controls-table table="works" label="Проделанные работы"></controls-table>
            <el-divider class="divider"></el-divider>
          </section>
          <section class="section" id="common_defects" :ref="(el) => (refs.common_defects = el)">
            <controls-table table="defects" label="Неисправности"></controls-table>
            <el-divider class="divider"></el-divider>
          </section>
          <section class="section" id="cabinets" :ref="(el) => (refs.cabinets = el)">
            <controls-table table="cabinets" label="Кабинеты"></controls-table>
            <el-divider class="divider"></el-divider>
          </section>
          <section class="section" id="urgency" :ref="(el) => (refs.urgency = el)">
            <controls-table table="urgency" label="Срочности" isUrgency></controls-table>
            <el-divider class="divider"></el-divider>
          </section>
          <section class="section" id="administrators" :ref="(el) => (refs.administrators = el)">
            <controls-table
              table="administrators"
              label="Администраторы"
              isAdministrator
            ></controls-table>
            <el-divider class="divider"></el-divider>
          </section>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserFilled, Menu } from "@element-plus/icons-vue";
import BaseMenu from "../components/BaseMenu.vue";
import ControlsTable from "../components/ControlsTable.vue";
import axios from "../../../shared/axios.js";

export default {
  components: {
    BaseMenu,
    ControlsTable
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const drawer = ref(false);
    const refs = ref({});

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    const logout = () => {
      axios.post("/dashboard/auth/logout").then(() => {
        router.push("/dashboard/login");
      });
    };

    const scrollToAnchorPoint = (refName) => {
      const el = refs.value[refName];
      el.scrollIntoView({ behavior: "smooth" });
    };

    const state = reactive({
      sectionObserver: null
    });

    const sectionObserverHandler = (entries) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          // Push sectionId to router here
          router.replace({
            name: route.name,
            hash: `#${sectionId}`,
            query: {
              isObserver: true
            }
          });
        }
      }
    };

    const observeSections = () => {
      const options = {
        rootMargin: "0px 0px",
        threshold: 0.5
      };
      state.sectionObserver = new IntersectionObserver(sectionObserverHandler, options);

      // Observe each section
      const sections = document.querySelectorAll(".section");
      sections.forEach((section) => {
        state.sectionObserver.observe(section);
      });
    };

    watch(
      () => router.currentRoute.value.hash,
      () => {
        if (router.currentRoute.value.hash && !router.currentRoute.value.query.isObserver) {
          scrollToAnchorPoint(router.currentRoute.value.hash.slice(1));
        }
      }
    );

    onMounted(() => {
      if (router.currentRoute.value.hash) {
        scrollToAnchorPoint(router.currentRoute.value.hash.slice(1));
      }
      observeSections();
    });

    return {
      drawer,
      refs,
      toggleDrawer,
      logout,
      UserFilled,
      Menu
    };
  }
};
</script>
