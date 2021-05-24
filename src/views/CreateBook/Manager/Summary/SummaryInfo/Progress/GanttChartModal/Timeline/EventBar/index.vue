<template>
  <BlockBar :items="events" custom-class="events">
    <template v-for="slot in slots" #[`slot${slot.id}`]>
      <EventFlag
        v-for="slotData in slot.slots"
        :key="slotData.id"
        :position="slotData.position"
        :description="slotData.name"
        :event-date="slotData.value"
        :is-short="slotData.isShort"
      />
    </template>
  </BlockBar>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
