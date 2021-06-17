<template>
  <div>
    <Send @click="onClick" />
    <Size
      :width="size.width"
      :height="size.height"
      :is-constrain="isConstrain"
    />
    <!-- <Position /> -->
    <div class="group-container">
      <Rotate />
      <v-divider vertical class="item-vertical"></v-divider>
      <Flip />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
