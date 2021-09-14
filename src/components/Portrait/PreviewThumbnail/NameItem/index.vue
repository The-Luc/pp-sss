<template>
  <div
    class="name"
    :class="{ 'under-portrait': isUnderPortrait }"
    :style="cssStyle"
  >
    <div :class="{ space: isFirstLastDisplay }">{{ firstName }}</div>

    <div :class="{ space: !isFirstLastDisplay }">
      <span>{{ lastName }}</span>

      <span v-if="!isFirstLastDisplay">,</span>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
