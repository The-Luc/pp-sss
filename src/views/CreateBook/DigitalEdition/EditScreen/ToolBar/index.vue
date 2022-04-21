<template lang="">
  <div class="col-12 digital-editor">
    <div class="row digital-editor-tool">
      <div class="tool-left">
        <ItemTool
          v-for="(item, index) in itemsToolLeft"
          :key="index"
          :items="item"
          :selected-tool-name="selectedToolName"
          :properties-type="propertiesType"
          :is-prompt="isPrompt"
          :disabled-items="disabledItems"
          @click="data => onClickLeftTool(data)"
        />
      </div>
      <div class="tool-right">
        <ItemTool
          v-for="(item, index) in itemsToolRight"
          :key="index"
          :items="item"
          :selected-tool-name="selectedToolName"
          :properties-type="propertiesType"
          :is-prompt="isPrompt"
          :disabled-items="disabledItems"
          @click="data => onClickRightTool(data)"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
