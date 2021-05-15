<template>
  <div class="item-tool">
    <ToolButton
      v-for="(icon, index) in items"
      :key="index"
      :icon-name="icon.iconName"
      :title="icon.title"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
