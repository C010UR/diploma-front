<template>
  <base-form header="Заявка на ремонт">
    <the-form></the-form>
  </base-form>
</template>

<script>
import TheForm from "./components/TheForm.vue";

export default {
  components: {
    TheForm
  }
};
</script>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  --el-color-primary: #6d81a2;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: var(--el-color-primary);
  margin: 0;
  padding: 0;
}
</style>
