<template>
  <div
    class="process-header text-700"
    :title="isTruncated && name"
    :style="color && { backgroundColor: color }"
  >
    <div ref="section" class="name">
      {{ name }}
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
