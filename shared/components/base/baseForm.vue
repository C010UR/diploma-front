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
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12),
    0px 1px 5px 0px rgba(0, 0, 0, 0.2);
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
