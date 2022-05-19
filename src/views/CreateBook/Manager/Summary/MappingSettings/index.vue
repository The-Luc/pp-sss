<template>
  <Section id="mapping-settings">
    <div class="group primary-format">
      <p>Primary Format:</p>
      <pp-select
        :items="primaryTypes"
        :selected-val="selectedPrimaryType"
        @change="onChangePrimaryFormat"
      ></pp-select>
    </div>
    <div class="group mapping-function">
      <p>Mapping Functionality:</p>
      <pp-select
        :items="mappingFuncTypes"
        :selected-val="selectedMappingFuncType"
        @change="onChangeMappingFunc"
      ></pp-select>
    </div>

    <p>Content mapping questions? Click <a @click="onClickHelp">here</a>.</p>
  </Section>
</template>

<script src="./script.js"></script>

<style scoped lang="scss" src="./style.scss"></style>
