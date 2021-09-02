<template>
  <div>
    <div class="display display-position">
      <div class="title-content ">Name Display:</div>
      <PpCombobox
        :items="textDisplay"
        :margin-menu="0"
        :nudge-width="126"
        :selected-val="displayVal"
        :appended-icon="appendedIcon"
        @change="onChangeDisplay"
      />
    </div>
    <div class="position-content">
      <div class="position display-position">
        <div class="title-content ">Name Position:</div>
        <PpCombobox
          :items="textPosition"
          :margin-menu="0"
          :nudge-width="126"
          :selected-val="positionVal"
          :appended-icon="appendedIcon"
          @change="onChangePosition"
        />
      </div>
      <div class="position">
        <div class="title-content">Name Width:</div>
        <PpCombobox
          :items="nameWidth"
          :margin-menu="0"
          :nudge-width="95"
          :selected-val="widthVal"
          :appended-icon="appendedIcon"
          @change="onChangeWidth"
        />
      </div>
    </div>
    <div class="name-gap">
      <div class="title-content">Name Gap:</div>
      <PpCombobox
        :items="nameGap"
        :margin-menu="0"
        :nudge-width="95"
        :selected-val="gapVal"
        :appended-icon="appendedIcon"
        @change="onChangeGap"
      />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
