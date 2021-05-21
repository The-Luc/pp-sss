<template>
  <div class="item-tool">
    <ToolButton
      v-for="(item, index) in items"
      :key="index"
      :icon-name="item.iconName"
      :title="item.title"
      @click="onClick(item)"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
