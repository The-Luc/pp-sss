<template>
  <div class="d-flex flex-column size-container">
    <span class="properties-title">Size:</span>
    <div class="d-flex">
      <TextFieldProperty value="3.32" title="Width" label="in." />
      <TextFieldProperty value="4.51" title="Height" label="in." />
      <label class="container-radio">
        <input type="checkbox" checked />
        <div class="checkmark"></div>
        <div>Constrain proportions</div>
      </label>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
