<template>
  <div class="flow-settings-container">
    <div class="title-setting">
      Flow Settings
    </div>
    <div class="flow-settings-content">
      <div class="flow-settings-single">
        <flow-select
          title="How should portraits be handled that extend beyond the selected page?"
          :disabled="isMultiple"
          :items="portraitFlowOptionSingle"
          :selected-val="selectedFlowSingle"
          @change="onChange"
        ></flow-select>
        <div v-if="isShowSelectPageSingle" class="page-select">
          <item-select
            v-for="(item, index) in dataSelectPageSingle"
            :key="index"
            :title="`Portraits ${item.startAsset}  - ${item.endAsset}:`"
            descript="Page"
            :disabled="index === 0"
            :selected-val="item.selectedVal"
            :items="item.pageOptions"
            @change="onChangePageSingle($event, index)"
          ></item-select>
        </div>
      </div>
      <div class="flow-settings-multiple">
        <flow-select
          title="How should multiple folders be handled?"
          :disabled="!isMultiple"
          :items="portraitFlowOptionMulti"
          :selected-val="selectedFlowMulti"
          @change="onChange"
        ></flow-select>
        <div v-if="isShowSelectPageMulti" class="page-select">
          <div v-for="(item, index) in dataSelectPageMulti" :key="index">
            <item-select
              v-if="index !== 0"
              :title="`Folder ${index + 1}:`"
              descript="Portrait flow starts on page:"
              :selected-val="item.selectedVal"
              :items="item.pageOptions"
              @change="onChangePageMulti($event, index)"
            ></item-select>
            <item-select
              v-if="index !== dataSelectPageMulti.length - 1"
              :title="index === 0 ? `Folder ${index + 1}:` : ''"
              descript="Portrait flow ends on page:"
              :disabled="true"
              :selected-val="item.selectedValEndOnPage"
              :items="pageOptions"
            ></item-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
