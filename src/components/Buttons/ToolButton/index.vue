<template>
  <div class="item" :class="customCssClass" @click="onClick">
    <div class="item-icon">
      <v-icon>{{ iconName }}</v-icon>
    </div>
    <p>{{ title }}</p>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
