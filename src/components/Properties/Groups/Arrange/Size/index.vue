<template>
  <div :key="componentKey" class="d-flex flex-column size-container">
    <span class="properties-title">Size:</span>
    <div class="d-flex">
      <TextFieldProperty
        :value="widthPt"
        :disabled="disabled"
        title="Width"
        label="in."
        @change="onChangeWidth"
      />
      <TextFieldProperty
        :value="heightPt"
        :disabled="disabled"
        title="Height"
        label="in."
        @change="onChangeHeight"
      />
      <label class="container-radio" :class="{ disabled }">
        <input
          type="checkbox"
          :disabled="disabled"
          :checked="isConstrain"
          @change="onChangeConstrain"
        />
        <div class="checkmark"></div>
        <div class="container-radio-label">Constrain proportions</div>
      </label>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
