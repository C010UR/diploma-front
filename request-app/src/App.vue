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
:root {
  --bg-color: #6d81a2;
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
