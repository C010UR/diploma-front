<template>
  <div class="container">
    <div class="header">
      <h1>{{ header }}</h1>
      <el-divider class="divider"></el-divider>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { ElDivider } from "element-plus";

export default {
  components: {
    ElDivider
  },
  props: ["header"]
};
</script>

<style scoped>
.container {
  display: block;
  margin: 10vh auto;
  padding: 1rem;
  width: 40%;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  transition: 0.3s;
}

.header {
  margin: 0;
  margin-bottom: 1rem;
}
.header h1 {
  color: var(--el-text-color-primary);
  margin: 0;
  margin-bottom: 0.75rem;
}
.header.divider {
  width: 100%;
  margin: 0 auto;
}

@media only screen and (max-width: 1250px) {
  .container {
    width: 60%;
  }
}

@media only screen and (max-width: 850px) {
  .container {
    width: 80%;
  }
}

@media only screen and (max-width: 600px) {
  .container {
    width: 100%;
  }
}
</style>
