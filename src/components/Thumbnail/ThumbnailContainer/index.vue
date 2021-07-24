<template>
  <div class="thumbnail-view-item" :class="displayCssClass">
    <div class="thumbnail-view-container">
      <Header
        :name="name"
        :color="color"
        :custom-css-class="customCssClass"
        :total-item="totalItem"
        :is-toggle-content-available="isToggleContentAvailable"
        @toggleContent="onToggleContent"
      />

      <Content
        v-show="isContentDisplayed"
        :to-link="toLink"
        :sheet-type="sheetType"
        :thumbnail-url="thumbnailUrl"
        :custom-css-class="customCssClass"
        :is-active="isActive"
        :is-edit-icon-displayed="!isEditor"
      />

      <Footer
        :link-type="linkType"
        :ordered-number="orderedNumber"
        :custom-css-class="customCssClass"
        :is-link-icon-displayed="!isEditor"
        @updateLink="onUpdateLink"
      />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
