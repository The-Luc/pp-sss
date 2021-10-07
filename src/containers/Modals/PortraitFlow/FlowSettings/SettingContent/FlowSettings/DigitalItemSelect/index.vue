<template>
  <div class="digital-item-select-container">
    <div class="select-container">
      <item-select
        v-if="indexItem !== 0"
        :title="`Folder ${indexItem + 1}:`"
        descript="Portrait flow starts on frame:"
        :selected-val="item.selectedVal"
        :items="item.frameOptions"
        @change="onFrameSettingChange"
      ></item-select>
      <item-select
        v-if="indexItem !== 0 && !isSingleScreen"
        class="screen-select"
        :title="''"
        descript="of"
        :selected-val="item.selectedValScreen"
        :items="item.screenOptions"
        @change="onScreenSettingChange"
      ></item-select>
    </div>
    <div class="select-container">
      <item-select
        v-if="indexItem !== lengthDataSelect - 1"
        :title="indexItem === 0 ? `Folder ${indexItem + 1}:` : ''"
        descript="Portrait flow ends on frame:"
        :disabled="true"
        :selected-val="item.selectedValEndOnFrame"
        :items="item.endOnFrameOptions"
      ></item-select>
      <item-select
        v-if="indexItem !== lengthDataSelect - 1 && !isSingleScreen"
        class="screen-select"
        :title="''"
        descript="of"
        :disabled="true"
        :selected-val="item.selectedValScreen"
        :items="item.screenOptions"
      ></item-select>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
