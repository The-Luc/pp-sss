<template lang="">
  <div class="col-12 print-editor">
    <div class="row print-editor-tool">
      <div class="tool-left">
        <ItemTool
          v-for="(item, index) in itemsToolLeft"
          :key="index"
          :items="item"
          @click="data => onClickLeftTool(data)"
        />
      </div>
      <div class="tool-right">
        <ItemTool
          v-for="(item, index) in itemsToolRight"
          :key="index"
          :items="item"
          @click="onClickRightTool"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
