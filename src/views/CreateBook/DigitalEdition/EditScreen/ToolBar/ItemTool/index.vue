<template>
  <div class="item-tool">
    <ToolButton
      v-for="(item, index) in items"
      :key="index"
      :is-active="isActive(item)"
      :icon-name="item.iconName"
      :title="item.title"
      :is-prompt="isPrompt"
      :disabled="isDisabledItem(item)"
      @click="onClick(item)"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
