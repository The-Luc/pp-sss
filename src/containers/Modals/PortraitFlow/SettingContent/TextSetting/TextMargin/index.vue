<template>
  <div class="margin">
    <div class="text-margin">Text Margins:</div>
    <div class="box-margin">
      Top Margin
      <PpCombobox
        :items="textMargin"
        :margin-menu="0"
        :nudge-width="80"
        :selected-val="topMargin"
        :appended-icon="appendedIcon"
        @change="onChangeTopMargin"
      />
    </div>
    <div class="box-margin">
      Left Margin
      <PpCombobox
        :items="textMargin"
        :margin-menu="0"
        :nudge-width="80"
        :selected-val="leftMargin"
        :appended-icon="appendedIcon"
        @change="onChangeLeftMargin"
      />
    </div>
    <div class="box-margin">
      Right Margin
      <PpCombobox
        :items="textMargin"
        :margin-menu="0"
        :nudge-width="80"
        :selected-val="rightMargin"
        :appended-icon="appendedIcon"
        @change="onChangeRightMargin"
      />
    </div>
    <div class="box-margin">
      Bottom Margin
      <PpCombobox
        :items="textMargin"
        :margin-menu="0"
        :nudge-width="80"
        :selected-val="bottomMargin"
        :appended-icon="appendedIcon"
        @change="onChangeBottomMargin"
      />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
