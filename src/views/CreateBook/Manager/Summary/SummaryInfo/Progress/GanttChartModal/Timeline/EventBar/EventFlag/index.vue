<template>
  <div
    class="event-flag"
    :class="isShort && 'short'"
    :style="{ left: getPosition() }"
  >
    <div class="flag-item">
      <img class="flag" src="@/assets/icons/event-flag-red.svg" />
      <span class="dot" />
    </div>

    <div class="flag-text">
      <div class="text-300 description">{{ description }}</div>
      <div class="text-500 event-date">{{ eventDate }}</div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
