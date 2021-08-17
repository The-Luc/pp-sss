<template>
  <div class="animation-container">
    <span class="properties-title">{{ title }}</span>
    <div class="animation-style">
      <Select
        :items="styleOptions"
        :selected-val="selectedStyle"
        @change="onChangeStyle"
      />

      <v-btn v-if="isShowOptions" outlined
        >Preview
        <v-icon right>
          mdi-play
        </v-icon>
      </v-btn>
    </div>
    <div v-if="isShowOptions" class="animation-option">
      <span class="properties-title">Order:</span>
      <PpCombobox
        :items="orderOptions"
        :appended-icon="appendedIcon"
        :selected-val="selectedOrder"
        @change="onChangeOrder"
      />
      <span class="properties-title">Duration:</span>
      <PpInput
        suffix="s"
        :value="durationValue"
        type="text"
        @change="onChangeDuration"
      />
      <span class="properties-title">Scale:</span>
      <PpInput
        suffix="%"
        :value="scaleValue"
        type="text"
        @change="onChangeScale"
      />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
