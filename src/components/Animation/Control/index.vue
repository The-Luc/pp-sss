<template>
  <div class="control-container">
    <span class="properties-title">{{ title }}</span>
    <div class="control-style">
      <div class="col-7">
        <PpSelect
          :items="styleOptions"
          :selected-val="selectedStyle"
          @change="onChangeStyle"
        />
      </div>
      <div class="col-5">
        <v-btn v-if="isShowOptions" outlined @click="onClickPreview">
          Preview
          <v-icon right>
            mdi-play
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div v-if="isShowOptions" :key="componentKey" class="control-options">
      <div v-if="selectedStyle.showDirection" class="control-item">
        <span class="properties-title">Direction</span>
        <PpSelect
          :items="directionOptions"
          :selected-val="selectedDirection"
          @change="onChangeDirection"
        />
      </div>
      <div class="control-item">
        <span class="properties-title">Order</span>
        <PpCombobox
          :items="orderOptions"
          :appended-icon="appendedIcon"
          :selected-val="selectedOrder"
          @change="onChangeOrder"
        />
      </div>
      <div class="control-item">
        <span class="properties-title">Duration</span>
        <PpInput
          suffix="s"
          :value="durationValue"
          :decimal="true"
          @change="onChangeDuration"
        />
      </div>
      <div v-if="selectedStyle.showScale" class="control-item">
        <span class="properties-title">Scale:</span>
        <PpInput
          suffix="%"
          :value="scaleValue"
          type="text"
          @change="onChangeScale"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
