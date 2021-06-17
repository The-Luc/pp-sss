<template>
  <div class="d-flex flex-column size-container">
    <span class="properties-title">Size:</span>
    <div class="d-flex">
      <TextFieldProperty :value="widthPt" title="Width" label="in." />
      <TextFieldProperty :value="heightPt" title="Height" label="in." />
      <label class="container-radio">
        <input type="checkbox" :checked="isConstrain" />
        <div class="checkmark"></div>
        <div class="container-radio-label">Constrain proportions</div>
      </label>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
