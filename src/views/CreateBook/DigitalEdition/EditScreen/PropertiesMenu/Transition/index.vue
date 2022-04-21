<template>
  <div class="transition-properties-container">
    <box-properties title="Transitions">
      <div class="transition-wrapper digital">
        <item
          v-for="(item, index) in transitions"
          :id="item.id"
          :key="item.id"
          :transition-index="index"
          :sheet-id="sheetId"
          :section-id="sectionId"
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
