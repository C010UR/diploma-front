<template>
  <base-form header="Заявка на ремонт">
    <the-form></the-form>
  </base-form>
</template>

<script>
import TheForm from "./components/TheForm.vue";
import BaseForm from "../../shared/components/BaseForm.vue";

export default {
  components: {
    TheForm,
    BaseForm
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&family=Open+Sans:wght@400;500;600&display=swap");

*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--el-text-color-primary);
  background-color: var(--el-color-primary);
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4 {
  font-family: "IBM Plex Sans", sans-serif;
}
</style>
