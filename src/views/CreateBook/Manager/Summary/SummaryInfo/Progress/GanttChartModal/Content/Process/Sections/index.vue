<template>
  <div class="sections">
    <Section v-for="section in sections" :key="section.id" :section="section" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
