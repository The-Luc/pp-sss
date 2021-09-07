<template>
  <div class="transition-properties-container">
    <box-properties title="Transitions">
      <div class="transition-wrapper">
        <item
          v-for="(item, index) in transitions"
          :key="index"
          :first-frame="index + 1"
          :second-frame="index + 2"
          :transition="item.transition"
          :direction="item.direction"
          :duration="item.duration"
        ></item>
      </div>
    </box-properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
