<template>
  <div
    class="item"
    :class="{ 'item--active': isActive, 'item--prompt': isActive && isPrompt }"
    @click="onClick"
  >
    <div class="item-icon">
      <v-icon>{{ iconName }}</v-icon>
    </div>
    <p>{{ title }}</p>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
