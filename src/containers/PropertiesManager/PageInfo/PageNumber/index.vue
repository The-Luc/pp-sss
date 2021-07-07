<template>
  <div class="page-number">
    <div class="page-number-title">Page Numbering {{ titleName }}:</div>
    <div class="page-number-container">
      <div class="status-page-number">
        <div v-if="!isSinglePage" class="title-status">Left hand page:</div>
        <div v-else class="title-status">On/Off:</div>
        <PpSelect
          :items="statusPageNumber"
          :selected-val="selectedLeftNumber"
          @change="onChangeStatusLeft"
        />
      </div>

      <div v-if="!isSinglePage" class="status-page-number">
        <div class="title-status">Right hand page:</div>
        <PpSelect
          :items="statusPageNumber"
          :selected-val="selectedRightNumber"
          @change="onChangeStatusRight"
        />
      </div>

      <div v-if="isCover" class="position-page-number">
        <div class="title-position">Position:</div>
        <PpSelect
          :items="positionPageNumber"
          :selected-val="selectedPosition"
          @change="onChangePosition"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
