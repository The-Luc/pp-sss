<template>
  <div class="title-container">
    <div v-if="name" class="name">
      {{ name }}
    </div>
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
