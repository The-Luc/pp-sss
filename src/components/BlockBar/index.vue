<template>
  <div class="blocks">
    <Block
      v-for="(item, index) in items"
      :key="index"
      :color="item.color"
      :text="item.texts"
      :data-attribute="item.dataAttributes"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
