<template lang="">
  <div class="col-12 print-editor">
    <div class="row print-editor-tool">
      <div class="tool-left">
        <ItemTool
          v-for="(item, index) in itemToolLeft"
          :key="index"
          :item="item"
        />
      </div>
      <div class="tool-right">
        <ItemTool
          v-for="(item, index) in itemToolRight"
          :key="index"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
