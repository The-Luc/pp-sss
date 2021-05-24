<template>
  <div class="blocks" :class="customClass">
    <Block
      v-for="(item, index) in items"
      :key="index"
      :color="item.color"
      :text="item.text"
      :data-attribute="item.dataAttributes"
    >
      <slot :name="item.slotName"></slot>
    </Block>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
