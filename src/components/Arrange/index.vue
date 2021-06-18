<template>
  <div>
    <Send @click="onClick" />
    <Size
      :width="size.width"
      :height="size.height"
      :is-constrain="isConstrain"
    />
    <Position :value-x="positionX" :value-y="positionY" />
    <div class="group-container">
      <Rotate
        :value="valueRotate"
        :max="maxRotate"
        :min="minRotate"
        @change="changeRotate"
      />
      <v-divider vertical class="item-vertical"></v-divider>
      <Flip />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
