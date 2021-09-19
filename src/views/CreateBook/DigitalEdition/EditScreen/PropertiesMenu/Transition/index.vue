<template>
  <div class="transition-properties-container">
    <box-properties title="Transitions">
      <div class="transition-wrapper digital">
        <item
          v-for="(item, index) in transitions"
          :key="index"
          :transition-index="index"
          :sheet-id="sheetId"
          :transition="item.transition"
          :direction="item.direction"
          :duration="item.duration"
          :is-expand-default="index === currentFrameIndex"
        ></item>
      </div>
    </box-properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
