<template>
  <div class="item" :style="{width: `${width}px`}">
    <div class="item-icon">
      <v-icon v-if="iconName">{{ iconName }}</v-icon>
      <span v-else>{{ textName }}</span>
    </div>
    <p v-if="title">{{ title }}</p>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
