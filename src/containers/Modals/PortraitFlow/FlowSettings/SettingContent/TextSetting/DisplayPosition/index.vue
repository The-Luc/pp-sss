<template>
  <div>
    <div class="display display-position">
      <div class="title-content ">Name Display:</div>
      <pp-select
        :items="textDisplay"
        :selected-val="displayVal"
        @change="onChangeDisplay"
      ></pp-select>
    </div>
    <div class="position-content">
      <div class="position display-position">
        <div class="title-content ">Name Position:</div>
        <pp-select
          :items="textPosition"
          :selected-val="positionVal"
          @change="onChangePosition"
        ></pp-select>
      </div>
      <div class="position">
        <div class="title-content">Name {{ optionPositionVal.name }}:</div>
        <pp-combobox
          :key="componentKey"
          :items="optionPositionVal.items"
          :margin-menu="0"
          :nudge-width="95"
          :selected-val="optionPositionVal.value"
          :appended-icon="appendedIcon"
          @change="optionPositionVal.onChangeFn"
        ></pp-combobox>
      </div>
    </div>
    <div v-if="!isCenterPosition" class="name-gap">
      <div class="title-content">Name Gap:</div>
      <pp-combobox
        :key="componentKey"
        :items="nameGap"
        :margin-menu="0"
        :nudge-width="95"
        :selected-val="gapVal"
        :appended-icon="appendedIcon"
        @change="onChangeGap"
      ></pp-combobox>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
