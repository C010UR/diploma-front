<template>
  <base-form>
    <the-header></the-header>
    <the-form></the-form>
  </base-form>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import TheForm from "./components/TheForm.vue";

export default {
  components: {
    TheHeader,
    TheForm
  }
};
</script>

<style>
:root {
  --bg-color: var(--el-text-color-primary);
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  margin: 0;
  padding: 0;
}
</style>
