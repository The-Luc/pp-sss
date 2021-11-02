<template>
  <block-bar :items="events" custom-class="events">
    <event-flag
      v-for="(eventFlag, index) in eventFlags"
      :key="`flag-${index}`"
      :position="eventFlag.position"
      :description="eventFlag.name"
      :event-date="eventFlag.value"
      :is-short="eventFlag.isShort"
    ></event-flag>
  </block-bar>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
