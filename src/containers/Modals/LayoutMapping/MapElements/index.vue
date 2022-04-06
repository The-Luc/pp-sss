<template>
  <div id="map-elements">
    <common-modal
      container="#map-elements"
      accept-text="Save"
      cancel-text="Cancel"
      title="Layout Mapping"
      width="1162"
      :is-open-modal="true"
      :is-accept-button-disabled="false"
      @cancel="onCancel"
      @accept="onSave"
    >
      <div class="map-elements__container">
        <div class="left-side">
          left
        </div>
        <div class="right-side">
          right
        </div>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
