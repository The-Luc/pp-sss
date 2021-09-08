<template>
  <div class="transition-properties-container">
    <box-properties title="Transitions">
      <div class="transition-wrapper">
        <item
          v-for="(item, index) in transitions"
          :key="index"
          :transition-index="index"
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
