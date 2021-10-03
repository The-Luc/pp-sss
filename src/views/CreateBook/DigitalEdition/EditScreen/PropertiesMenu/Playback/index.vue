<template>
  <div class="playback-properties-container">
    <box-properties title="Playback">
      <div class="playback-wrapper digital">
        <item
          v-for="(item, index) in items"
          :key="index"
          :name="item.name"
          :value="item.value"
          :frame-id="item.frameId"
          @click="onSelect"
        ></item>
      </div>
    </box-properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
