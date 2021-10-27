<template>
  <BlockBar :items="events" custom-class="events">
    <EventFlag
      v-for="(eventFlag, index) in eventFlags"
      :key="`flag-${index}`"
      :position="eventFlag.position"
      :description="eventFlag.name"
      :event-date="eventFlag.value"
      :is-short="eventFlag.isShort"
    />
  </BlockBar>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
