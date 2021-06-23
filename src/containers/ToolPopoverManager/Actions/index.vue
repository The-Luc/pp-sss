<template>
  <div class="actions-container">
    <Item
      v-for="item in items"
      :key="item.value"
      :item="item"
      @click="onClick"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
