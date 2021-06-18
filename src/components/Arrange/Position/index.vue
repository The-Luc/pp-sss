<template>
  <div class="d-flex flex-column position-container">
    <span class="properties-title">Position:</span>
    <div class="d-flex">
      <TextFieldProperty
        :value="valueX"
        title="X"
        label="in."
        @change="onChangeValueX"
      />
      <TextFieldProperty
        :value="valueY"
        title="Y"
        label="in."
        @change="onChangeValueY"
      />
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
