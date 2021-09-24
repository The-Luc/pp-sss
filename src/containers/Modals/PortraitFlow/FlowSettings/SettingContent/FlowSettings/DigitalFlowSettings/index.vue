<template>
  <div class="flow-settings-container">
    <div class="title-setting">
      Flow Settings
    </div>
    <div class="flow-settings-content">
      <div class="flow-settings-single">
        <flow-select
          title="How should portraits be handled that extend beyond the selected frame?"
          :disabled="isMultiple"
          :items="portraitFlowOptionSingle"
          :selected-val="selectedFlowSingle"
          @change="onFlowSettingChange"
        ></flow-select>
        <div
          :class="['flow-settings-message', { 'disabled-massage': isMultiple }]"
        >
          (Note: Frames will be added as needed based on current portrait
          settings)
        </div>
        <div v-if="isShowSelectFrameSingle" class="frame-select">
          <item-select
            v-for="(item, index) in dataSelectFrameSingle"
            :key="index"
            :title="`Portraits ${item.startAsset}  - ${item.endAsset}:`"
            descript="Frame:"
            :disabled="index === 0"
            :selected-val="item.selectedVal"
            :items="item.frameOptions"
            @change="onFrameSettingChange($event, item.frameIndex, item.screen)"
          ></item-select>
        </div>
      </div>
      <div class="flow-settings-multiple">
        <flow-select
          title="How should multiple folders be handled?"
          :disabled="!isMultiple"
          :items="portraitFlowOptionMulti"
          :selected-val="selectedFlowMulti"
          @change="onFlowSettingChange"
        ></flow-select>
        <div v-if="isShowSelectFrameMulti" class="frame-select">
          <div v-for="(item, index) in dataSelectFrameMulti" :key="index">
            <div class="select-container">
              <item-select
                v-if="index !== 0"
                :title="`Folder ${index + 1}:`"
                descript="Portrait flow starts on frame:"
                :selected-val="item.selectedVal"
                :items="item.frameOptions"
                @change="
                  onFrameSettingChange($event, item.frameIndex, item.screen)
                "
              ></item-select>
              <item-select
                v-if="index !== 0 && !isSingleScreen"
                class="screen-select"
                :title="''"
                descript="of"
                :selected-val="item.selectedValScreen"
                :items="item.screenOptions"
                @change="
                  onScreenSettingChange($event, item.frameIndex, item.screen)
                "
              ></item-select>
            </div>
            <div class="select-container">
              <item-select
                v-if="index !== dataSelectFrameMulti.length - 1"
                :title="index === 0 ? `Folder ${index + 1}:` : ''"
                descript="Portrait flow ends on frame:"
                :disabled="true"
                :selected-val="item.selectedValEndOnFrame"
                :items="item.endOnFrameOptions"
              ></item-select>
              <item-select
                v-if="
                  index !== dataSelectFrameMulti.length - 1 && !isSingleScreen
                "
                class="screen-select"
                :title="''"
                descript="of"
                :disabled="true"
                :selected-val="item.selectedValScreen"
                :items="item.screenOptions"
              ></item-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
