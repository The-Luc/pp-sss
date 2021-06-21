<template>
  <div>
    <Send @change="changeZIndex" />
    <Size
      :width="sizeWidth"
      :height="sizeHeight"
      :is-constrain="isConstrain"
      @change="onChange"
      @changeConstrain="onChangeConstrain"
    />
    <Position :value-x="positionX" :value-y="positionY" @change="onChange" />
    <div class="group-container">
      <Rotate
        :value="valueRotate"
        :max="maxRotate"
        :min="minRotate"
        @change="onChange"
      />
      <v-divider vertical class="item-vertical"></v-divider>
      <Flip @change="changeFlip" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
