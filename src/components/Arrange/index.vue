<template>
  <div>
    <Send :disabled="disabled" @change="changeZIndex" />
    <Size
      :width="sizeWidth"
      :height="sizeHeight"
      :min-size="minSize"
      :max-size="maxSize"
      :disabled="disabled"
      :is-constrain="isConstrain"
      @change="onChange"
      @changeConstrain="onChangeConstrain"
    />
    <Position
      :min="minPosition"
      :max="maxPosition"
      :value-x="position.x"
      :value-y="position.y"
      :disabled="disabled"
      @change="onChange"
    />
    <div class="group-container">
      <Rotate :disabled="disabled" :value="rotateValue" @change="onChange" />
      <v-divider vertical class="item-vertical"></v-divider>
      <Flip :disabled="disabled" @change="changeFlip" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
