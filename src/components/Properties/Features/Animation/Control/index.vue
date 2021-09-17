<template>
  <div class="control-container">
    <span class="properties-title" :class="{ disabled: disabled }">
      {{ title }}
    </span>

    <div class="control-style">
      <div class="col-7">
        <pp-select
          :disabled="disabled"
          :items="styleOptions"
          :selected-val="selectedStyle"
          @change="onChangeStyle"
        ></pp-select>
      </div>

      <div class="col-5">
        <v-btn
          v-if="isShowOptions"
          outlined
          :disabled="isDisabledPreview"
          @click="onClickPreview"
        >
          Preview
          <v-icon right>mdi-play</v-icon>
        </v-btn>
      </div>
    </div>

    <div v-if="showApplyOptions" class="control-style mt-3">
      <div class="col-7">
        <pp-select
          class="apply-select"
          :items="applyOptions"
          :selected-val="selectedApplyOption"
          placeholder="Apply to..."
          @change="onChangeApplyOption"
        ></pp-select>
      </div>

      <div v-if="showApplyButton" class="col-5">
        <v-btn class="apply-btn" outlined @click="onClickApply">
          Apply
        </v-btn>
      </div>
    </div>

    <div v-if="isShowOptions" :key="componentKey" class="control-options">
      <div v-if="selectedStyle.showDirection" class="control-item">
        <span class="properties-title">Direction</span>
        <pp-select
          :items="directionOptions"
          :selected-val="selectedDirection"
          @change="onChangeDirection"
        ></pp-select>
      </div>

      <div class="control-item">
        <span class="properties-title" :class="{ disabled: isOrderDisabled }"
          >Order</span
        >
        <pp-combobox
          max-height="200"
          :items="orderOptions"
          :appended-icon="appendedIcon"
          :selected-val="selectedOrder"
          :disabled="isOrderDisabled"
          @change="onChangeOrder"
        ></pp-combobox>
      </div>

      <div class="control-item">
        <span class="properties-title">Duration</span>
        <pp-input
          suffix="s"
          :value="durationValue"
          :decimal="true"
          @change="onChangeDuration"
        ></pp-input>
      </div>

      <div v-if="selectedStyle.showScale" class="control-item">
        <span class="properties-title">Scale</span>
        <pp-input
          suffix="%"
          :value="scaleValue"
          type="text"
          @change="onChangeScale"
        ></pp-input>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
