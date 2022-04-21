<template>
  <div id="print-preview">
    <common-modal
      title="Preview"
      cancel-text="Close"
      container="#print-preview"
      width="1162"
      :is-open-modal="isOpenModal"
      :is-close-icon-displayed="false"
      @cancel="onCancel"
    >
      <div
        :class="[
          'thumbnail',
          {
            'haft-right': isHaftRight,
            'haft-left': isHaftLeft
          }
        ]"
      >
        <img
          v-if="currentSheet.thumbnailLeftUrl"
          :src="currentSheet.thumbnailLeftUrl"
          alt="thumbnail"
        />
        <img
          v-if="currentSheet.thumbnailRightUrl"
          :src="currentSheet.thumbnailRightUrl"
          alt="thumbnail"
        />
      </div>
      <div class="navigation">
        <move-control
          is-back-control
          :disabled="!isPosibleToBack"
          @click="onBack"
        ></move-control>
        <div class="selected-page">
          <div class="selected-page-title">
            Pages
          </div>
          <pp-select
            id="selected-page"
            container="#selected-page"
            :items="sheetOptions"
            :selected-val="selectedVal"
            @change="onChange"
          ></pp-select>
        </div>
        <move-control
          :is-back-control="false"
          :disabled="!isPosibleToNext"
          @click="onNext"
        ></move-control>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
