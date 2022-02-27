<template>
  <div>
    <slot></slot>
  </div>
</template>

<style scoped>
div {
  display: block;
  margin: 10vh auto;
  padding: 1rem;
  width: 40%;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  transition: 0.3s;
}

@media only screen and (max-width: 1300px) {
  div {
    width: 60%;
  }
}

@media only screen and (max-width: 900px) {
  div {
    width: 80%;
  }
}

@media only screen and (max-width: 700px) {
  div {
    width: 100%;
  }
}
</style>
