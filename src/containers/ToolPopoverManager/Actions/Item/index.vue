<template>
  <div
    class="action-item"
    :class="{ disabled: item.disabled }"
    @click="onClick"
  >
    <label>{{ item.name }}</label>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
