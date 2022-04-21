<template>
  <div
    class="control-container"
    :class="{ disabled: disabled }"
    @click="onClick"
  >
    <i class="material-icons-outlined outer">
      circle
    </i>

    <i class="material-icons-outlined inner" :class="innerCssClass">
      {{ iconName }}
    </i>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
