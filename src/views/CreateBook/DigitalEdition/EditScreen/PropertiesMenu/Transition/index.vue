<template>
  <div class="transitions-properties-container">
    <box-properties title="Transitions">
      <item
        v-for="(item, index) in transitions"
        :key="index"
        :first-frame="index + 1"
        :second-frame="index + 2"
        :transition="item.transition"
        :direction="item.direction"
        :duration="item.duration"
      ></item>
    </box-properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
