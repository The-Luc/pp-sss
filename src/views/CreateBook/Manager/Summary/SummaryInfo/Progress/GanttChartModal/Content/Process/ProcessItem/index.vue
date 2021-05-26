<template>
  <div class="process-item">
    <Header :name="name" :color="headerColor" />

    <div class="process-body">
      <slot />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
