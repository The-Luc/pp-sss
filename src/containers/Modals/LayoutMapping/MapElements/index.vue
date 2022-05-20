<template>
  <div v-show="isCanvasReady" id="map-elements">
    <common-modal
      container="#map-elements"
      accept-text="Save"
      cancel-text="Cancel"
      title="Layout Mapping"
      width="1162"
      :is-open-modal="true"
      :is-accept-button-disabled="!isEnableSaveButton"
      @cancel="onCancel"
      @accept="onSave"
    >
      <div class="map-elements__container">
        <div class="left-side">
          <div class="print-preview">
            <p class="preview-title">Print</p>
            <preview-item
              :images="printPreview"
              :is-single-layout="isSingleLayout"
              :id-of-active-image="idOfActiveImage"
              @change="setActiveImage"
            />
          </div>
          <div class="digital-preview">
            <p class="preview-title">Digital</p>
            <preview-item
              :images="digitalPreview"
              :is-digital="true"
              :id-of-active-image="idOfActiveImage"
              @change="setActiveImage"
            />
          </div>
        </div>
        <div class="right-side">
          <p class="right-side__title">{{ isPrint ? 'Print' : 'Digital' }}</p>
          <p class="right-side__note">
            (Note: Click an image and/or text box to map its position.)
          </p>
          <div :class="['layout-canvas-container', { digital: !isPrint }]">
            <canvas
              id="layout-mapping-canvas"
              ref="layout-mapping-canvas"
            ></canvas>
          </div>
          <div
            :class="[
              'right-side__canvas-name',
              { 'single-layout': isSingleLayout && isPrint }
            ]"
          >
            <div v-if="isSingleLayout && isPrint">
              Single Page
            </div>
            <div v-else-if="isPrint" class="right-side__canvas-name--print">
              <p>Left Page</p>
              <p>Right Page</p>
            </div>
            <div v-else class="right-side__canvas-name--digital">
              {{ frameName }}
            </div>
          </div>
        </div>
        <number-palettes
          :pos-x="posX"
          :pos-y="posY"
          :items="numberList"
          :is-open="isOpenMenu"
          @change="onChooseNumber"
        ></number-palettes>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
