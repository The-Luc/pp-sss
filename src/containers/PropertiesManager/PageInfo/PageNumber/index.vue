<template>
  <div class="page-number">
    <div class="page-number-title">{{ titleName }}</div>
    <div class="page-number-container">
      <div class="status-page-number">
        <div class="title-status">{{ statusPageLeft }}</div>
        <PpSelect
          :items="statusPageNumber"
          :selected-val="{ name: 'On', value: true }"
          @change="onChangeStatusLeft"
        />
      </div>
      <div v-if="!isSiglePage" class="status-page-number">
        <div class="title-status">{{ statusPageRight }}</div>
        <PpSelect
          :items="statusPageNumber"
          :selected-val="{ name: 'On', value: true }"
          @change="onChangeStatusRight"
        />
      </div>
      <div v-if="isCover" class="position-page-number">
        <div class="title-position">Position:</div>
        <PpSelect
          :items="positionPageNumber"
          :selected-val="{
            name: 'Bottom Center',
            value: 'BOTTOM_CENTER'
          }"
          @change="onChangePosition"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
