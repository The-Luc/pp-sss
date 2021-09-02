<template>
  <div class="layout-setting-container">
    <div v-for="row in dataUI" :key="row.name" class="control-group">
      <div class="control-name">{{ row.name }}</div>
      <pp-combobox
        :items="row.options"
        :margin-menu="0"
        :nudge-width="80"
        :selected-val="row.selected"
        :appended-icon="appendedIcon"
        @change="row.onChangeFn"
      />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
